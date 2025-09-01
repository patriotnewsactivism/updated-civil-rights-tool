const CL_ENDPOINT = 'https://www.courtlistener.com/api/rest/v3/search/';

exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || '').trim();
    const page = event.queryStringParameters?.page || '1';
    if (!q) return json(400, { error: "Missing required 'q' query parameter." });

    const url = new URL(CL_ENDPOINT);
    url.searchParams.set('q', q);
    url.searchParams.set('type', 'o'); // opinions only
    url.searchParams.set('order_by', 'score desc');
    url.searchParams.set('page', String(page));

    const res = await fetch(url.toString(), { headers: { 'User-Agent': 'civil-rights.netlify.app (Netlify Function)' } });
    if (!res.ok) return json(res.status, { error: 'Upstream error', details: (await res.text()).slice(0, 4000) });

    const data = await res.json();
    const items = (data?.results || []).map((r) => ({
      id: r.id,
      caseName: r.caseName || r.caseNameShort || r.caption || 'Untitled',
      citation: r.citation || (r.citesTo?.[0]?.cite || null),
      court: r.court_citation || r.court || r.court_str || null,
      date: r.dateFiled || r.dateArgued || r.dateModified || null,
      url: r.absolute_url ? https://www.courtlistener.com : null,
      snippet: r.snippet || null,
    }));

    return json(200, { items, raw: { count: data.count, next: data.next, previous: data.previous } });
  } catch (err) {
    return json(500, { error: 'Unexpected error', details: String(err?.message || err) });
  }
};

function json(statusCode, body) {
  return { statusCode, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } };
}
