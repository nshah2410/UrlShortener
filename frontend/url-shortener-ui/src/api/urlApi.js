// Thin client for the URL-shortener backend. All calls go through the Vite
// proxy (/api -> http://localhost:8080).

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// Create a short link. `slug` is optional; backend assigns Base62 when blank.
export async function shortenUrl(longUrl, slug) {
  const res = await fetch("/api/urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: longUrl, slug: slug || undefined }),
  });
  return handle(res);
}

export async function listUrls() {
  return handle(await fetch("/api/urls"));
}

export async function deleteUrl(id) {
  return handle(await fetch(`/api/urls/${id}`, { method: "DELETE" }));
}

export async function updateUrl(id, patch) {
  const res = await fetch(`/api/urls/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle(res);
}

export async function getAnalytics(id) {
  return handle(await fetch(`/api/urls/${id}/analytics`));
}
