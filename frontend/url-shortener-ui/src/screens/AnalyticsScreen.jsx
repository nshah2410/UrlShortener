import { useMemo } from "react";
import { useApp } from "../store/appContext";
import { avatarBg, fullUrl, getAnalytics, initial } from "../lib/helpers";

function MetricCard({ label, value, big }) {
  return (
    <div className="rounded-[14px] border border-line bg-white px-[18px] py-4">
      <div className="mb-[7px] text-[12px] font-medium text-muted-2">
        {label}
      </div>
      <div
        className={`font-display font-bold ${
          big ? "mt-1 text-[18px]" : "text-[26px]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Breakdown({ title, rows, barColor }) {
  return (
    <div className="rounded-[16px] border border-line bg-white px-5 py-[18px]">
      <div className="mb-4 font-display text-[14px] font-semibold">{title}</div>
      <div className="flex flex-col gap-[13px]">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="mb-[6px] flex justify-between">
              <span className="text-[12.5px] font-medium text-ink-2">
                {r.name}
              </span>
              <span className="font-mono text-[12px] font-semibold text-muted-2">
                {r.pct}
              </span>
            </div>
            <div className="h-[7px] rounded-full bg-[#f0f1f4]">
              <div
                className="h-full rounded-full"
                style={{ width: r.w, background: barColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsScreen() {
  const { links, selectedLinkId } = useApp();
  const selLink = links.find((l) => l.id === selectedLinkId) || links[0];
  const full = fullUrl(selLink);
  const an = useMemo(() => getAnalytics(selLink), [selLink]);

  return (
    <div className="mx-auto max-w-[1140px] animate-fadeUp px-[30px] pb-[60px] pt-[28px]">
      {/* Header row */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-[14px]">
        <div className="flex items-center gap-[13px]">
          <div
            className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] font-display text-[17px] font-bold text-white"
            style={{ background: avatarBg(selLink) }}
          >
            {initial(selLink)}
          </div>
          <div>
            <div className="font-display text-[17px] font-bold -tracking-[0.01em]">
              {selLink.title}
            </div>
            <a
              href={"https://" + full}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[13px] font-medium text-accent no-underline"
            >
              {full}
            </a>
          </div>
        </div>
        <div className="flex gap-[6px] rounded-[10px] border border-line-input bg-white p-1">
          {["14 days", "30 days", "All time"].map((range, i) => (
            <span
              key={range}
              className={`rounded-[7px] px-3 py-[6px] font-display text-[12.5px] font-semibold ${
                i === 0 ? "bg-accent text-white" : "text-muted"
              }`}
            >
              {range}
            </span>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="mb-4 grid grid-cols-4 gap-[14px]">
        <MetricCard label="Total clicks" value={an.totalFmt} />
        <MetricCard label="Unique visitors" value={an.uniqueFmt} />
        <MetricCard label="Top location" value={`🇺🇸 ${an.topLoc}`} big />
        <MetricCard label="Top referrer" value={an.topRef} big />
      </div>

      {/* Clicks over time */}
      <div className="mb-4 rounded-[16px] border border-line bg-white px-[22px] py-5">
        <div className="mb-[18px] font-display text-[14px] font-semibold">
          Clicks over time
        </div>
        <div className="flex h-[180px] items-end gap-[6px]">
          {an.days.map((d, i) => (
            <div
              key={i}
              title={`${d.v} clicks`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="min-h-[4px] w-full max-w-[26px] rounded-[5px_5px_2px_2px] bg-[linear-gradient(180deg,#3b6cff,rgba(59,108,255,.6))] transition hover:brightness-[1.12]"
                style={{ height: d.h }}
              />
              <span className="h-[12px] font-mono text-[9.5px] text-[#b3b8c2]">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown grid */}
      <div className="grid grid-cols-2 gap-4">
        <Breakdown title="Top referrers" rows={an.referrers} barColor="#3b6cff" />
        <Breakdown title="Devices" rows={an.devices} barColor="#15b87f" />
        <Breakdown title="Locations" rows={an.locations} barColor="#6b5cff" />
        <Breakdown title="Browsers" rows={an.browsers} barColor="#11131a" />
      </div>
    </div>
  );
}
