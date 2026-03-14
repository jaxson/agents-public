exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const path = params.path;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'path' parameter" }),
    };
  }

  const url = `https://api.openparliament.ca${path}?format=json`;

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
      body: JSON.stringify({ error: "Failed to fetch meeting detail" }),
    };
  }
};
