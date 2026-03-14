exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const document = params.document;
  const limit = parseInt(params.limit) || 20;
  const offset = parseInt(params.offset) || 0;

  if (!document) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'document' parameter" }),
    };
  }

  const url = `https://api.openparliament.ca/speeches/?format=json&document=${encodeURIComponent(document)}&limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch speeches" }),
    };
  }
};
