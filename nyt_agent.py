import os
import requests
from dotenv import load_dotenv
from uagents import Agent, Context, Model

load_dotenv()

# ===== MODELS =====
class NYTSearchRequest(Model):
    query: str                # keyword(s) or phrase
    begin_date: str | None = None   # format: YYYYMMDD
    end_date: str | None = None     # format: YYYYMMDD

class Article(Model):
    headline: str | None
    pub_date: str | None
    url: str | None
    section: str | None
    snippet: str | None

class NYTSearchResponse(Model):
    count: int
    articles: list[Article]

class HealthResponse(Model):
    status: str


# ===== CONFIG =====
NYT_API_KEY = os.getenv("NYT_KEY")
if not NYT_API_KEY:
    raise RuntimeError("Missing NYT_KEY in environment (.env).")

SEARCH_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json"


agent = Agent(
    name="nyt-search-agent",
    seed="nyt-search-agent-secret-seed",
    port=6000,
    endpoint=["http://127.0.0.1:6000/submit"],
)


# ===== NYT SEARCH LOGIC =====
def search_articles(query: str, begin_date: str | None, end_date: str | None) -> list[Article]:
    params = {
        "q": query,
        "api-key": NYT_API_KEY,
        "sort": "relevance",
    }

    if begin_date:
        params["begin_date"] = begin_date
    if end_date:
        params["end_date"] = end_date

    resp = requests.get(SEARCH_URL, params=params, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    docs = data.get("response", {}).get("docs", [])
    out: list[Article] = []

    for d in docs:
        out.append(
            Article(
                headline=(d.get("headline") or {}).get("main"),
                pub_date=d.get("pub_date"),
                url=d.get("web_url"),
                section=d.get("section_name"),
                snippet=d.get("snippet"),
            )
        )
    return out


# ===== REST ENDPOINTS =====
@agent.on_rest_get("/health", HealthResponse)
async def health(_: Context) -> HealthResponse:
    return HealthResponse(status="ok")


@agent.on_rest_post("/nyt/search", NYTSearchRequest, NYTSearchResponse)
async def nyt_search(ctx: Context, req: NYTSearchRequest) -> NYTSearchResponse:
    ctx.logger.info(f"NYT SEARCH: '{req.query}' from {req.begin_date} to {req.end_date}")
    articles = search_articles(req.query, req.begin_date, req.end_date)
    return NYTSearchResponse(count=len(articles), articles=articles)


if __name__ == "__main__":
    agent.run()