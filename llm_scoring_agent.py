import os
import json
from typing import Any, Dict, List
from dotenv import load_dotenv
from uagents import Agent, Context, Model
from openai import OpenAI

load_dotenv()

CHAT_MODEL = "gpt-4o-mini"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY or OPENAI_KEY in environment")


# ========= uAgents MESSAGE MODELS =========
class AIRequest(Model):
    question: str


class AIResponse(Model):
    answer: str


# ========= REST API MODELS =========
class LLMScoreRequest(Model):
    query: str
    results: Dict[str, Any]  # articles returned by NYT agent,


class LLMScoreResponse(Model):
    score: float | None = None
    flags: list[str] | None = None
    description: str | None = None


# ========= AGENT INIT =========
agent = Agent(
    name="llm-agent",
    seed="llm-agent-seed",
    port=8001,
    endpoint=["http://127.0.0.1:8001/submit"],   # REST server
)


# ========= LLM CALL FUNCTION =========
def query_openai_chat(prompt: str) -> str:
    client = OpenAI(api_key=OPENAI_API_KEY)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": prompt},
        ],
        model=CHAT_MODEL,
    )
    return chat_completion.choices[0].message.content


# ========= AGENT-TO-AGENT MESSAGE HANDLER =========
@agent.on_message(model=AIRequest, replies=AIResponse)
async def handle_ai_message(ctx: Context, sender: str, msg: AIRequest):
    ctx.logger.info(f"Received AIRequest from {sender}: {msg.question}")
    response = query_openai_chat(msg.question)
    await ctx.send(sender, AIResponse(answer=response))


# ========= REST ENDPOINT FOR SCORING =========
def build_prompt(query: str, results: Dict[str, Any]) -> str:
    # Summarize NYT articles to keep prompt compact
    articles: List[Dict[str, Any]] = []
    nyt = results.get("nyt") or {}
    if isinstance(nyt, dict):
        for a in (nyt.get("articles") or [])[:8]:
            articles.append({
                "headline": a.get("headline"),
                "pub_date": a.get("pub_date"),
                "section": a.get("section"),
                "snippet": a.get("snippet"),
            })

    system = (
        "You are a news credibility analyzer. Given a user query/claim and articles from news sources, "
        "output a JSON object with EXACTLY these fields:\n\n"
        "1. score: float between 0.0-1.0 (0=not credible/no evidence, 1=highly credible)\n"
        "2. flags: array of strings from these options ONLY:\n"
        "   - 'heated debate' (controversial/polarizing topic)\n"
        "   - 'irrelevant info' (personal/off-topic/not newsworthy)\n"
        "   - 'not news' (opinion/satire/blog post)\n"
        "   - 'insufficient sources' (limited corroboration)\n"
        "   - 'biased coverage' (one-sided reporting)\n"
        "   Use empty array [] if none apply.\n"
        "3. description: EXACTLY 2-3 sentences providing evidence-based reasoning.\n\n"
        "Be strict JSON format: no markdown, no extra keys, no trailing commas."
    )

    payload = {"query": query, "articles": articles}
    return f"{system}\n\nINPUT:\n{json.dumps(payload, ensure_ascii=False)}\n\nOUTPUT (JSON ONLY):"


def parse_llm_json(text: str) -> Dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`\n")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(cleaned[start:end + 1])
        raise


@agent.on_rest_post("/llm/score", LLMScoreRequest, LLMScoreResponse)
async def score_endpoint(ctx: Context, req: LLMScoreRequest) -> LLMScoreResponse:
    try:
        prompt = build_prompt(req.query, req.results)
        raw = query_openai_chat(prompt)
        parsed = parse_llm_json(raw)

        score = parsed.get("score")
        flags = parsed.get("flags")
        description = parsed.get("description")

        # Validate and convert score
        if isinstance(score, str):
            try:
                score = float(score)
            except:
                pass
        
        # Ensure score is between 0-1
        if isinstance(score, (int, float)):
            score = max(0.0, min(1.0, float(score)))
        
        # Validate flags is a list
        if not isinstance(flags, list):
            flags = []

        # Validate response has required fields
        if not isinstance(score, (int, float)) or not description:
            raise ValueError("Invalid LLM response format")

        ctx.logger.info(f"LLM Score: {score}, Flags: {flags}")
        return LLMScoreResponse(score=float(score), flags=flags, description=description)

    except Exception as e:
        ctx.logger.error(f"LLM scoring failed: {e}")
        return LLMScoreResponse(score=None, flags=None, description=None)


# ========= RUN AGENT =========
if __name__ == "__main__":
    agent.run()
