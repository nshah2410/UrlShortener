import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteUrl, listUrls, shortenUrl } from "../api/urlApi";
import { fullUrl, mapApiLink } from "../lib/helpers";
import { AppContext } from "./appContext";

// Seed data ported from the design prototype.
const INITIAL_LINKS = [
  {
    id: "l1",
    title: "Product launch thread",
    slug: "launch",
    dest: "https://twitter.com/snip/status/1788452190",
    clicks: 12480,
    days: 2,
    domain: "sn.ip",
  },
  {
    id: "l2",
    title: "Spring pricing update",
    slug: "pricing",
    dest: "https://rivera.studio/pricing",
    clicks: 3920,
    days: 5,
    domain: "sn.ip",
  },
  {
    id: "l3",
    title: "Newsletter signup",
    slug: "join",
    dest: "https://rivera.studio/newsletter",
    clicks: 2110,
    days: 8,
    domain: "sn.ip",
  },
  {
    id: "l4",
    title: "Portfolio 2026",
    slug: "work",
    dest: "https://janerivera.design/portfolio",
    clicks: 1740,
    days: 12,
    domain: "sn.ip",
  },
  {
    id: "l5",
    title: "Launch demo video",
    slug: "demo",
    dest: "https://youtu.be/dQw4w9WgXcQ",
    clicks: 980,
    days: 16,
    domain: "sn.ip",
  },
  {
    id: "l6",
    title: "Resume (PDF)",
    slug: "cv",
    dest: "https://janerivera.design/resume.pdf",
    clicks: 432,
    days: 21,
    domain: "sn.ip",
  },
];

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("create");
  const [authed, setAuthed] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [domain] = useState("sn.ip");
  const [query, setQuery] = useState("");
  const [created, setCreated] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedCreated, setCopiedCreated] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState("l1");
  const [qrColor, setQrColor] = useState("#11131a");
  const [utm, setUtm] = useState(true);
  const [cloak, setCloak] = useState(false);
  const [linksLoading, setLinksLoading] = useState(true);
  const [shortenError, setShortenError] = useState(null);
  const [shortening, setShortening] = useState(false);

  const copyTimer = useRef(null);
  const copyCreatedTimer = useRef(null);

  const go = useCallback((s) => setScreen(s), []);

  // Load real links from the backend on mount; fall back to seed data offline.
  useEffect(() => {
    let active = true;
    listUrls()
      .then((data) => {
        if (!active) return;
        const mapped = data.map(mapApiLink);
        if (mapped.length) {
          setLinks(mapped);
          setSelectedLinkId(mapped[0].id);
        }
      })
      .catch(() => {
        // Backend unreachable — keep the seed data already in state.
      })
      .finally(() => active && setLinksLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const copyLink = useCallback((id, text) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    clearTimeout(copyTimer.current);
    setCopiedId(id);
    copyTimer.current = setTimeout(() => setCopiedId(null), 1300);
  }, []);

  const copyCreated = useCallback(() => {
    setCreated((c) => {
      if (c) {
        try {
          navigator.clipboard?.writeText("https://" + fullUrl(c));
        } catch {
          /* clipboard unavailable */
        }
      }
      return c;
    });
    clearTimeout(copyCreatedTimer.current);
    setCopiedCreated(true);
    copyCreatedTimer.current = setTimeout(() => setCopiedCreated(false), 1300);
  }, []);

  // Shorten via the backend; prepend the created link and show the success card.
  const shorten = useCallback(async () => {
    const raw = (longUrl || "").trim();
    if (!raw) return;
    setShortenError(null);
    setShortening(true);
    try {
      const data = await shortenUrl(raw, customSlug.trim());
      const link = mapApiLink(data);
      setLinks((prev) => [link, ...prev.filter((l) => l.id !== link.id)]);
      setCreated(link);
      setSelectedLinkId(link.id);
      setLongUrl("");
      setCustomSlug("");
    } catch (err) {
      // Surface 409 (slug taken) and other failures to the Create form.
      setShortenError(err.message || "Could not shorten that URL.");
    } finally {
      setShortening(false);
    }
  }, [longUrl, customSlug]);

  const deleteLink = useCallback(async (id) => {
    // Optimistically remove; restore on failure.
    let removed;
    setLinks((prev) => {
      removed = prev.find((l) => l.id === id);
      return prev.filter((l) => l.id !== id);
    });
    setCreated((c) => (c && c.id === id ? null : c));
    try {
      await deleteUrl(id);
    } catch {
      if (removed) setLinks((prev) => [removed, ...prev]);
    }
  }, []);

  const goToLinkAnalytics = useCallback((id) => {
    setSelectedLinkId(id);
    setScreen("analytics");
  }, []);

  const goToLinkQr = useCallback((id) => {
    setSelectedLinkId(id);
    setScreen("qr");
  }, []);

  const value = useMemo(
    () => ({
      // state
      screen,
      authed,
      authMode,
      links,
      longUrl,
      customSlug,
      domain,
      query,
      created,
      copiedId,
      copiedCreated,
      selectedLinkId,
      qrColor,
      utm,
      cloak,
      linksLoading,
      shortenError,
      shortening,
      // setters
      setLongUrl,
      setCustomSlug,
      setQuery,
      setQrColor,
      setSelectedLinkId,
      setAuthMode,
      // actions
      go,
      copyLink,
      copyCreated,
      shorten,
      deleteLink,
      goToLinkAnalytics,
      goToLinkQr,
      clearShortenError: () => setShortenError(null),
      toggleUtm: () => setUtm((v) => !v),
      toggleCloak: () => setCloak((v) => !v),
      login: () => {
        setAuthed(true);
        setScreen("create");
      },
      logout: () => setAuthed(false),
    }),
    [
      screen,
      authed,
      authMode,
      links,
      longUrl,
      customSlug,
      domain,
      query,
      created,
      copiedId,
      copiedCreated,
      selectedLinkId,
      qrColor,
      utm,
      cloak,
      linksLoading,
      shortenError,
      shortening,
      go,
      copyLink,
      copyCreated,
      shorten,
      deleteLink,
      goToLinkAnalytics,
      goToLinkQr,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
