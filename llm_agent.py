import time
import requests
from typing import Any, Dict
from uagents import Agent, Context, Model


# === CONFIG ===
# Internal agent REST endpoints (expandable)
NEWS_AGENTS: Dict[str, str] = {
    "nyt": "http://127.0.0.1:6000/nyt/search",
    # "bloomberg": "http://127.0.0.1:6003/bloomberg/search",
    # "ap": "http://127.0.0.1:6002/ap/search",
    # "reddit": "http://127.0.0.1:6004/reddit/search",
}

# Optional LLM agent endpoint (expects POST with { query, results })
LLM_AGENT_URL: str | None = "http://127.0.0.1:8001/llm/score"


# === REQUEST/RESPONSE MODELS ===
class FactCheckRequest(Model):
    query: str
    begin_date: str | None = None   # YYYYMMDD
    end_date: str | None = None     # YYYYMMDD

class FactCheckResponse(Model):
    # Only what the LLM returns
    score: float | None = None
    flags: list[str] | None = None
    description: str | None = None


# === AGENT INIT ===
agent = Agent(
    name="gateway-agent",
    seed="gateway-agent-seed",
    port=8000,
    endpoint=["http://127.0.0.1:8000/submit"],
)


# === HEALTH CHECK ===
class HealthResponse(Model):
    status: str

@agent.on_rest_get("/health", HealthResponse)
async def health(_: Context) -> HealthResponse:
    return HealthResponse(status="ok")


# === SINGLE PUBLIC ENDPOINT: FACT-CHECK ===
@agent.on_rest_post("/fact-check", FactCheckRequest, FactCheckResponse)
async def fact_check(ctx: Context, req: FactCheckRequest) -> FactCheckResponse:
    ctx.logger.info(
        f"FACT-CHECK: query='{req.query}', begin={req.begin_date}, end={req.end_date}"
    )

    aggregated: Dict[str, Any] = {}
    for name, url in NEWS_AGENTS.items():
        try:
            payload = {
                "query": req.query,
                "begin_date": req.begin_date,
                "end_date": req.end_date,
            }
            resp = requests.post(url, json=payload, timeout=90)
            resp.raise_for_status()
            aggregated[name] = resp.json()
        except Exception as e:
            aggregated[name] = {"error": str(e)}

    score: float | None = None
    flags: list[str] | None = None
    description: str | None = None

    if LLM_AGENT_URL:
        try:
            llm_payload = {"query": req.query, "results": aggregated}
            llm_resp = requests.post(LLM_AGENT_URL, json=llm_payload, timeout=120)
            llm_resp.raise_for_status()
            llm_json = llm_resp.json()
            # expected keys: score (number), flags (array), description (string)
            score = llm_json.get("score")
            flags = llm_json.get("flags")
            description = (
                llm_json.get("description")
                or llm_json.get("reasoning")
                or llm_json.get("desc")
            )
        except Exception as e:
            ctx.logger.error(f"LLM call failed: {e}")

    return FactCheckResponse(
        score=score,
        flags=flags,
        description=description,
    )


if __name__ == "__main__":
    agent.run()