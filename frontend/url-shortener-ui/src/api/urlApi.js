// POST a long URL to the backend and return the created mapping.
// Backend responds with { originalUrl, shortCode, shortUrl, clickCount }.
export async function shortenUrl(longUrl) {
  const res = await fetch("/api/urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: longUrl }),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
