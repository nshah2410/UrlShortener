// Pure helpers ported from the design prototype's logic class.

// FNV-1a hash → stable per-id colors / seeded RNG.
export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Seeded LCG random number generator.
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function fmt(n) {
  return (n || 0).toLocaleString("en-US");
}

export function fullUrl(link) {
  return (link.domain || "sn.ip") + "/" + link.slug;
}

const SLUG_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
export function genSlug() {
  let o = "";
  for (let i = 0; i < 6; i++)
    o += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  return o;
}

export function sanitizeSlug(raw) {
  return (raw || "").replace(/[^a-z0-9-]/gi, "").toLowerCase();
}

export function initial(link) {
  return (link.title || "L").trim().charAt(0).toUpperCase();
}

const AVATAR_PALETTE = [
  "#3b6cff",
  "#15b87f",
  "#6b5cff",
  "#ff6b6b",
  "#f59e0b",
  "#0ea5b7",
  "#ec4899",
  "#8b5cf6",
];
export function avatarBg(link) {
  return AVATAR_PALETTE[hash(link.id) % AVATAR_PALETTE.length];
}

// Normalize a typed URL: add https:// if no protocol, derive a title from host.
export function normalizeUrl(raw) {
  const url = (raw || "").trim();
  const withProto = /^https?:/.test(url) ? url : "https://" + url;
  let title = "New link";
  try {
    title = new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    /* leave default */
  }
  return { dest: withProto, title };
}

export function relativeTime(days) {
  return days === 0 ? "Just now" : days + "d ago";
}

// Deterministically generate analytics for a link (seeded, like the prototype).
export function getAnalytics(link) {
  const rnd = rng(hash(link.id + "a"));
  const n = 14;
  const base = Math.max(6, link.clicks / n);
  const raw = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend = 0.55 + 0.8 * t;
    const noise = 0.5 + rnd() * 0.95;
    raw.push(Math.max(3, Math.round(base * trend * noise)));
  }
  const max = Math.max(...raw);
  const mo = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const baseDate = new Date(2026, 5, 21);
  const days = raw.map((v, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (n - 1 - i));
    return {
      v,
      h: Math.max(5, Math.round((v / max) * 100)) + "%",
      label:
        i % 3 === 0 || i === n - 1 ? mo[d.getMonth()] + " " + d.getDate() : "",
    };
  });
  const mk = (list) => {
    const mx = Math.max(...list.map((x) => x.v));
    return list.map((x) => ({
      name: x.name,
      w: Math.round((x.v / mx) * 100) + "%",
      pct: x.v + "%",
    }));
  };
  const refSets = [
    ["Twitter / X", "Direct", "Instagram", "LinkedIn", "Newsletter"],
    ["Direct", "LinkedIn", "Twitter / X", "Reddit", "Email"],
    ["Instagram", "Direct", "TikTok", "Twitter / X", "Newsletter"],
  ];
  const set = refSets[hash(link.id) % refSets.length];
  const rv = [38, 24, 16, 13, 9];
  const referrers = mk(set.map((name, i) => ({ name, v: rv[i] })));
  const devices = mk([
    { name: "Mobile", v: 62 },
    { name: "Desktop", v: 31 },
    { name: "Tablet", v: 7 },
  ]);
  const locations = mk([
    { name: "United States", v: 41 },
    { name: "United Kingdom", v: 14 },
    { name: "Germany", v: 9 },
    { name: "Canada", v: 8 },
    { name: "India", v: 7 },
    { name: "Other", v: 21 },
  ]);
  const browsers = mk([
    { name: "Chrome", v: 58 },
    { name: "Safari", v: 27 },
    { name: "Firefox", v: 9 },
    { name: "Edge", v: 6 },
  ]);
  return {
    days,
    totalFmt: fmt(link.clicks),
    uniqueFmt: fmt(Math.round(link.clicks * 0.74)),
    topLoc: "United States",
    topRef: referrers[0].name,
    referrers,
    devices,
    locations,
    browsers,
  };
}
