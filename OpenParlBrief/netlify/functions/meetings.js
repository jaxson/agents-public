exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const limit = parseInt(params.limit) || 20;
  const offset = parseInt(params.offset) || 0;

  let url = `https://api.openparliament.ca/committees/meetings/?format=json&limit=${limit}&offset=${offset}`;
  if (params.committee) {
    url += `&committee=${encodeURIComponent(params.committee)}`;
  }

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch meetings" }),
    };
  }
};
