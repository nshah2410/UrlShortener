import { useMemo } from "react";
import { useApp } from "../store/appContext";
import {
  BarChartIcon,
  CheckIcon,
  CopyIcon,
  FilterIcon,
  QrIcon,
  SearchIcon,
} from "../components/icons";
import { avatarBg, fmt, fullUrl, initial, relativeTime } from "../lib/helpers";

function StatCard({ label, children }) {
  return (
    <div className="rounded-[14px] border border-line bg-white px-[18px] py-4">
      <div className="mb-[7px] text-[12px] font-medium text-muted-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function IconButton({ title, onClick, active, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-[32px] w-[32px] items-center justify-center rounded-[8px] border transition hover:bg-[#f1f3f9] ${
        active
          ? "border-[#bfe9d4] bg-success-bg text-success"
          : "border-[#e6e8ee] bg-white text-[#6b707b] hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function LinkRow({ link }) {
  const { copiedId, copyLink, goToLinkAnalytics, goToLinkQr } = useApp();
  const full = fullUrl(link);
  const copied = copiedId === link.id;
  return (
    <div className="grid grid-cols-[1fr_110px_130px_96px] items-center gap-3 border-b border-line-faint px-[18px] py-[13px] transition hover:bg-surface-alt2">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] font-display text-[15px] font-bold text-white"
          style={{ background: avatarBg(link) }}
        >
          {initial(link)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-[13.5px] font-semibold text-ink">
              {link.title}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <a
              href={"https://" + full}
              target="_blank"
              rel="noreferrer"
              className="flex-none font-mono text-[12.5px] font-medium text-accent no-underline"
            >
              {full}
            </a>
            <span className="flex-none text-[#d4d7de]">·</span>
            <span className="truncate text-[12px] text-muted-4">
              {link.dest}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right font-display text-[14px] font-bold">
        {fmt(link.clicks)}
      </div>
      <div className="text-[13px] text-muted">{relativeTime(link.days)}</div>
      <div className="flex justify-end gap-[6px]">
        <IconButton title="QR code" onClick={() => goToLinkQr(link.id)}>
          <QrIcon size={15} strokeWidth={1.7} />
        </IconButton>
        <IconButton
          title={copied ? "Copied" : "Copy link"}
          onClick={() => copyLink(link.id, "https://" + full)}
          active={copied}
        >
          {copied ? (
            <CheckIcon size={15} strokeWidth={2.4} stroke="#15a06b" />
          ) : (
            <CopyIcon size={15} />
          )}
        </IconButton>
        <IconButton
          title="Analytics"
          onClick={() => goToLinkAnalytics(link.id)}
        >
          <BarChartIcon size={15} />
        </IconButton>
      </div>
    </div>
  );
}

export default function LinksScreen() {
  const { links, query, setQuery } = useApp();

  const stats = useMemo(() => {
    const totalClicks = links.reduce((a, b) => a + b.clicks, 0);
    const best = links.reduce(
      (a, b) => (b.clicks > a.clicks ? b : a),
      links[0]
    );
    return {
      links: links.length,
      clicks: fmt(totalClicks),
      week: fmt(Math.round(totalClicks * 0.16)),
      best: best ? best.title : "—",
    };
  }, [links]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return links.filter(
      (l) =>
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.slug.includes(q) ||
        l.dest.toLowerCase().includes(q)
    );
  }, [links, query]);

  return (
    <div className="mx-auto max-w-[1140px] animate-fadeUp px-[30px] pb-[60px] pt-[28px]">
      {/* Stat cards */}
      <div className="mb-[22px] grid grid-cols-4 gap-[14px]">
        <StatCard label="Total links">
          <div className="font-display text-[26px] font-bold -tracking-[0.01em]">
            {stats.links}
          </div>
        </StatCard>
        <StatCard label="Total clicks">
          <div className="font-display text-[26px] font-bold -tracking-[0.01em]">
            {stats.clicks}
          </div>
        </StatCard>
        <StatCard label="Clicks this week">
          <div className="flex items-baseline gap-2">
            <div className="font-display text-[26px] font-bold -tracking-[0.01em]">
              {stats.week}
            </div>
            <span className="font-display text-[12px] font-semibold text-success">
              +18%
            </span>
          </div>
        </StatCard>
        <StatCard label="Top performer">
          <div className="mt-1 truncate font-display text-[15px] font-bold">
            {stats.best}
          </div>
        </StatCard>
      </div>

      {/* Toolbar */}
      <div className="mb-[14px] flex items-center justify-between gap-3">
        <div className="focus-ring flex h-[42px] w-[300px] items-center gap-[9px] rounded-[11px] border border-line-input bg-white px-[13px]">
          <SearchIcon size={17} className="text-muted-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search links…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex h-[42px] items-center gap-[7px] rounded-[11px] border border-line-input bg-white px-[14px] font-display text-[13px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]">
            <FilterIcon size={15} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <div className="grid grid-cols-[1fr_110px_130px_96px] gap-3 border-b border-line-faint bg-surface-alt2 px-[18px] py-[11px] font-display text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-3">
          <span>Link</span>
          <span className="text-right">Clicks</span>
          <span>Created</span>
          <span className="text-right">Actions</span>
        </div>
        {filtered.map((link) => (
          <LinkRow key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
