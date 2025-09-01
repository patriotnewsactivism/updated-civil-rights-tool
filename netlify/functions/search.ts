import type { Handler } from "@netlify/functions";

// CourtListener search: https://www.courtlistener.com/api/rest/v3/search/
// We only use public endpoints; set a friendly UA.
const CL_ENDPOINT = "https://www.courtlistener.com/api/rest/v3/search/";

export const handler: Handler = async (event) => {
  try {
    const q = event.queryStringParameters?.q?.trim();
    const page = event.queryStringParameters?.page ?? "1";

    if (!q) {
      return json(400, { error: "Missing required 'q' query parameter." });
    }

    const url = new URL(CL_ENDPOINT);
    url.searchParams.set("q", q);
    url.searchParams.set("type", "o"); // opinions only
    url.searchParams.set("order_by", "score desc");
    url.searchParams.set("page", String(page));

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "civil-rights.netlify.app (Netlify Function)" },
    });

    if (!res.ok) {
      const text = await res.text();
      return json(res.status, { error: "Upstream error", details: text.slice(0, 4000) });
    }

    const data = (await res.json()) as any;

    const items = (data?.results ?? []).map((r: any) => ({
      id: r.id,
      caseName: r.caseName ?? r.caseNameShort ?? r.caption ?? "Untitled",
      citation: r.citation ?? r.citationCount ?? r.citesTo?.[0]?.cite ?? null,
      court: r.court_citation ?? r.court ?? r.court_str ?? null,
      date: r.dateFiled ?? r.dateArgued ?? r.dateModified ?? null,
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : null,
      snippet: r.snippet ?? null,
    }));

    return json(200, { items, raw: { count: data.count, next: data.next, previous: data.previous } });
  } catch (err: any) {
    return json(500, { error: "Unexpected error", details: String(err?.message ?? err) });
  }
};

function json(statusCode: number, body: unknown) {
  return { statusCode, body: JSON.stringify(body), headers: { "Content-Type": "application/json" } };
}