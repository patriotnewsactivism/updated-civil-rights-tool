// Mock search API function for Netlify Functions
exports.handler = async (event) => {
  try {
    // Parse query parameters
    const q = (event.queryStringParameters?.q || '').trim();
    const page = event.queryStringParameters?.page || '1';
    const court = event.queryStringParameters?.court || '';
    const yearStart = event.queryStringParameters?.year_start || '';
    const yearEnd = event.queryStringParameters?.year_end || '';
    const sort = event.queryStringParameters?.sort || 'relevance';
    
    // Return error if no query provided
    if (!q) {
      return json(400, { error: 'Search query is required' });
    }
    
    // Generate mock search results
    const mockResults = generateMockResults(q, court, yearStart, yearEnd, sort);
    
    return json(200, {
      items: mockResults,
      query: q,
      filters: {
        court,
        yearStart,
        yearEnd,
        sort
      },
      pagination: {
        count: mockResults.length,
        next: null,
        previous: null
      }
    });
  } catch (error) {
    console.error('Mock search error:', error);
    return json(500, { error: 'Internal server error', details: String(error) });
  }
};

// Helper function to return JSON response
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

// Generate mock search results based on query and filters
function generateMockResults(query, court, yearStart, yearEnd, sort) {
  // Sample case data
  const cases = [
    {
      id: '1',
      caseName: 'Brown v. Board of Education',
      citation: '347 U.S. 483 (1954)',
      court: 'Supreme Court of the United States',
      date: '1954-05-17',
      snippet: 'Separate educational facilities are inherently unequal. Therefore, we hold that the plaintiffs and others similarly situated for whom the actions have been brought are, by reason of the segregation complained of, deprived of the equal protection of the laws guaranteed by the Fourteenth Amendment.',
      url: 'https://supreme.justia.com/cases/federal/us/347/483/'
    },
    {
      id: '2',
      caseName: 'Obergefell v. Hodges',
      citation: '576 U.S. 644 (2015)',
      court: 'Supreme Court of the United States',
      date: '2015-06-26',
      snippet: 'The right to marry is a fundamental right inherent in the liberty of the person, and under the Due Process and Equal Protection Clauses of the Fourteenth Amendment couples of the same-sex may not be deprived of that right and that liberty.',
      url: 'https://supreme.justia.com/cases/federal/us/576/644/'
    },
    {
      id: '3',
      caseName: 'Miranda v. Arizona',
      citation: '384 U.S. 436 (1966)',
      court: 'Supreme Court of the United States',
      date: '1966-06-13',
      snippet: 'The person in custody must, prior to interrogation, be clearly informed that he has the right to remain silent, and that anything he says will be used against him in court; he must be clearly informed that he has the right to consult with a lawyer and to have the lawyer with him during interrogation.',
      url: 'https://supreme.justia.com/cases/federal/us/384/436/'
    },
    {
      id: '4',
      caseName: 'New York Times Co. v. Sullivan',
      citation: '376 U.S. 254 (1964)',
      court: 'Supreme Court of the United States',
      date: '1964-03-09',
      snippet: 'The constitutional guarantees require, we think, a federal rule that prohibits a public official from recovering damages for a defamatory falsehood relating to his official conduct unless he proves that the statement was made with "actual malice"—that is, with knowledge that it was false or with reckless disregard of whether it was false or not.',
      url: 'https://supreme.justia.com/cases/federal/us/376/254/'
    },
    {
      id: '5',
      caseName: 'Tinker v. Des Moines Independent Community School District',
      citation: '393 U.S. 503 (1969)',
      court: 'Supreme Court of the United States',
      date: '1969-02-24',
      snippet: 'It can hardly be argued that either students or teachers shed their constitutional rights to freedom of speech or expression at the schoolhouse gate.',
      url: 'https://supreme.justia.com/cases/federal/us/393/503/'
    },
    {
      id: '6',
      caseName: 'Gideon v. Wainwright',
      citation: '372 U.S. 335 (1963)',
      court: 'Supreme Court of the United States',
      date: '1963-03-18',
      snippet: 'The right of one charged with crime to counsel may not be deemed fundamental and essential to fair trials in some countries, but it is in ours. From the very beginning, our state and national constitutions and laws have laid great emphasis on procedural and substantive safeguards designed to assure fair trials before impartial tribunals in which every defendant stands equal before the law.',
      url: 'https://supreme.justia.com/cases/federal/us/372/335/'
    },
    {
      id: '7',
      caseName: 'Texas v. Johnson',
      citation: '491 U.S. 397 (1989)',
      court: 'Supreme Court of the United States',
      date: '1989-06-21',
      snippet: 'If there is a bedrock principle underlying the First Amendment, it is that the government may not prohibit the expression of an idea simply because society finds the idea itself offensive or disagreeable.',
      url: 'https://supreme.justia.com/cases/federal/us/491/397/'
    },
    {
      id: '8',
      caseName: 'Roe v. Wade',
      citation: '410 U.S. 113 (1973)',
      court: 'Supreme Court of the United States',
      date: '1973-01-22',
      snippet: 'This right of privacy, whether it be founded in the Fourteenth Amendment\'s concept of personal liberty and restrictions upon state action, as we feel it is, or, as the District Court determined, in the Ninth Amendment\'s reservation of rights to the people, is broad enough to encompass a woman\'s decision whether or not to terminate her pregnancy.',
      url: 'https://supreme.justia.com/cases/federal/us/410/113/'
    },
    {
      id: '9',
      caseName: 'Loving v. Virginia',
      citation: '388 U.S. 1 (1967)',
      court: 'Supreme Court of the United States',
      date: '1967-06-12',
      snippet: 'Marriage is one of the "basic civil rights of man," fundamental to our very existence and survival. To deny this fundamental freedom on so unsupportable a basis as the racial classifications embodied in these statutes, classifications so directly subversive of the principle of equality at the heart of the Fourteenth Amendment, is surely to deprive all the State\'s citizens of liberty without due process of law.',
      url: 'https://supreme.justia.com/cases/federal/us/388/1/'
    },
    {
      id: '10',
      caseName: 'Mapp v. Ohio',
      citation: '367 U.S. 643 (1961)',
      court: 'Supreme Court of the United States',
      date: '1961-06-19',
      snippet: 'All evidence obtained by searches and seizures in violation of the Constitution is, by that same authority, inadmissible in a state court.',
      url: 'https://supreme.justia.com/cases/federal/us/367/643/'
    }
  ];
  
  // Filter by court if specified
  let filteredCases = cases;
  if (court) {
    const courtLower = court.toLowerCase();
    if (courtLower === 'scotus') {
      filteredCases = filteredCases.filter(c => c.court.includes('Supreme Court'));
    } else if (courtLower.startsWith('ca')) {
      const circuitNum = courtLower.substring(2);
      filteredCases = filteredCases.filter(c => c.court.includes(`${circuitNum}th Circuit`));
    }
  }
  
  // Filter by year range if specified
  if (yearStart) {
    const startYear = parseInt(yearStart);
    filteredCases = filteredCases.filter(c => {
      const caseYear = new Date(c.date).getFullYear();
      return caseYear >= startYear;
    });
  }
  
  if (yearEnd) {
    const endYear = parseInt(yearEnd);
    filteredCases = filteredCases.filter(c => {
      const caseYear = new Date(c.date).getFullYear();
      return caseYear <= endYear;
    });
  }
  
  // Filter by query terms
  const queryLower = query.toLowerCase();
  filteredCases = filteredCases.filter(c => 
    c.caseName.toLowerCase().includes(queryLower) || 
    c.snippet.toLowerCase().includes(queryLower)
  );
  
  // Sort results
  if (sort === 'date-desc') {
    filteredCases.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === 'date-asc') {
    filteredCases.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    // Sort by relevance (simple implementation - count query occurrences)
    filteredCases.sort((a, b) => {
      const countA = (a.caseName.toLowerCase().split(queryLower).length - 1) + 
                     (a.snippet.toLowerCase().split(queryLower).length - 1);
      const countB = (b.caseName.toLowerCase().split(queryLower).length - 1) + 
                     (b.snippet.toLowerCase().split(queryLower).length - 1);
      return countB - countA;
    });
  }
  
  return filteredCases;
}