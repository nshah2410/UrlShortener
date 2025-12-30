export async function shortenUrl(longUrl) {
  const res = await fetch("/api/urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: longUrl }),
  });

  return res.text();
}
