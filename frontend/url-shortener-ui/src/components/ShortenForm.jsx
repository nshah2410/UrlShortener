import { useState } from "react";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [shortData, setShortData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setShortData(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Shorten</button>
      </form>

      {shortData && (
        <div>
          <p>Original URL: {shortData.originalUrl}</p>
          <p>
            Short URL:{" "}
            <a href={shortData.shortUrl} target="_blank" rel="noreferrer">
              {shortData.shortUrl}
            </a>
          </p>
          <p>Click Count: {shortData.clickCount}</p>
        </div>
      )}
    </div>
  );
}
