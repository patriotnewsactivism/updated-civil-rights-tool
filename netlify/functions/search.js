const CL_ENDPOINT = 'https://www.courtlistener.com/api/rest/v3/search/';

exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || '').trim();
    const page = event.queryStringParameters?.page || '1';
    const court = event.queryStringParameters?.court || '';
    const yearStart = event.queryStringParameters?.year_start || '';
    const yearEnd = event.queryStringParameters?.year_end || '';
    const sort = event.queryStringParameters?.sort || 'score desc';
    
    if (!q) return json(400, { error: "Missing required 'q' query parameter." });

    const url = new URL(CL_ENDPOINT);
    url.searchParams.set('q', q);
    url.searchParams.set('type', 'o'); // opinions only
    
    // Set sort order
    if (sort === 'date-desc') {
      url.searchParams.set('order_by', 'dateFiled desc');
    } else if (sort === 'date-asc') {
      url.searchParams.set('order_by', 'dateFiled asc');
    } else {
      url.searchParams.set('order_by', 'score desc');
    }
    
    url.searchParams.set('page', String(page));
    
    // Add court filter if specified
    if (court) {
      url.searchParams.set('court', court);
    }
    
    // Add date range filters if specified
    if (yearStart) {
      const startDate = `${yearStart}-01-01`;
      url.searchParams.set('filed_after', startDate);
    }
    
    if (yearEnd) {
      const endDate = `${yearEnd}-12-31`;
      url.searchParams.set('filed_before', endDate);
    }

    const res = await fetch(url.toString(), { 
      headers: { 'User-Agent': 'civil-rights.netlify.app (Netlify Function)' } 
    });
    
    if (!res.ok) {
      console.error('Upstream error:', await res.text());
      return json(res.status, { 
        error: 'Error fetching results from court database',
        details: `Status: ${res.status} ${res.statusText}`
      });
    }

    const data = await res.json();
    const items = (data?.results || []).map((r) => ({
      id: r.id,
      caseName: r.caseName || r.caseNameShort || r.caption || 'Untitled',
      citation: r.citation || (r.citesTo?.[0]?.cite || null),
      court: r.court_citation || r.court || r.court_str || null,
      date: r.dateFiled || r.dateArgued || r.dateModified || null,
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : null,
      snippet: r.snippet || null,
    }));

    return json(200, { 
      items, 
      query: q,
      filters: {
        court,
        yearStart,
        yearEnd,
        sort
      },
      pagination: { 
        count: data.count, 
        next: data.next, 
        previous: data.previous 
      } 
    });
  } catch (err) {
    console.error('Search function error:', err);
    return json(500, { 
      error: 'Unexpected error', 
      details: String(err?.message || err) 
    });
  }
};

function json(statusCode, body) {
  return { 
    statusCode, 
    body: JSON.stringify(body), 
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    } 
  };
}