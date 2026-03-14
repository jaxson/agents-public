const UPSTREAM = "https://api.openparliament.ca/committees/?format=json&limit=100";

exports.handler = async () => {
  try {
    const res = await fetch(UPSTREAM, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to fetch committees" }),
    };
  }
};
