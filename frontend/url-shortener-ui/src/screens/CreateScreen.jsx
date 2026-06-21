import { useApp } from "../store/appContext";
import QrCode from "../components/QrCode";
import { CheckIcon, CopyIcon, GlobeIcon } from "../components/icons";
import { avatarBg, fmt, fullUrl, initial } from "../lib/helpers";

function RecentRow({ link }) {
  const { copyLink } = useApp();
  const full = fullUrl(link);
  return (
    <div className="flex items-center gap-[13px] rounded-[12px] border border-line bg-white px-[14px] py-3">
      <div
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] font-display text-[14px] font-bold text-white"
        style={{ background: avatarBg(link) }}
      >
        {initial(link)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[14px] font-semibold text-ink">
          {full}
        </div>
        <div className="truncate text-[12px] text-muted-3">{link.dest}</div>
      </div>
      <div className="flex-none text-right">
        <div className="font-display text-[14px] font-bold">
          {fmt(link.clicks)}
        </div>
        <div className="text-[10.5px] uppercase tracking-[0.05em] text-muted-4">
          clicks
        </div>
      </div>
      <button
        onClick={() => copyLink(link.id, "https://" + full)}
        title="Copy"
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] border border-[#e6e8ee] bg-white text-[#6b707b] transition hover:bg-[#f6f7f9] hover:text-ink"
      >
        <CopyIcon size={15} />
      </button>
    </div>
  );
}

function SuccessCard() {
  const { created, copiedCreated, copyCreated, go } = useApp();
  if (!created) return null;
  const full = fullUrl(created);
  return (
    <div className="mt-[18px] flex animate-pop items-center gap-[18px] rounded-[18px] border border-line bg-white p-5 shadow-card">
      <div className="h-[96px] w-[96px] flex-none overflow-hidden rounded-[12px] border border-[#eef0f3] bg-white p-[6px]">
        <QrCode value={"https://" + full} color="#11131a" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-[5px] flex items-center gap-2">
          <span className="inline-flex items-center gap-[5px] rounded-full bg-success-bg px-[9px] py-[3px] font-display text-[11.5px] font-semibold text-success">
            <CheckIcon size={12} strokeWidth={2.6} stroke="#15a06b" />
            Link created
          </span>
        </div>
        <a
          href={"https://" + full}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-[22px] font-semibold -tracking-[0.01em] text-accent no-underline"
        >
          {full}
        </a>
        <div className="mt-[3px] truncate text-[13px] text-muted-3">
          {created.dest}
        </div>
      </div>
      <div className="flex flex-none flex-col gap-2">
        <button
          onClick={copyCreated}
          className="flex min-w-[118px] items-center justify-center gap-[7px] rounded-[10px] bg-ink px-[14px] py-[10px] font-display text-[13px] font-semibold text-white transition hover:brightness-[1.3]"
        >
          <CopyIcon size={14} stroke="#fff" />
          {copiedCreated ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={() => go("analytics")}
          className="min-w-[118px] rounded-[10px] border border-line-input bg-white px-[14px] py-[10px] font-display text-[13px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]"
        >
          View stats
        </button>
      </div>
    </div>
  );
}

export default function CreateScreen() {
  const { longUrl, setLongUrl, customSlug, setCustomSlug, shorten, links } =
    useApp();
  const recent = links.slice(0, 3);

  const onSubmit = (e) => {
    e.preventDefault();
    shorten();
  };

  return (
    <div className="mx-auto max-w-[760px] animate-fadeUp px-[30px] pb-[60px] pt-[46px]">
      {/* Intro */}
      <div className="mb-[30px] text-center">
        <div className="mb-[10px] inline-block font-display text-[12px] font-semibold uppercase tracking-[0.04em] text-accent">
          Snip a link
        </div>
        <h2 className="mb-2 font-display text-[34px] font-bold -tracking-[0.02em]">
          Make it short. Make it yours.
        </h2>
        <p className="text-[15px] text-muted">
          Paste any long URL and get a tidy{" "}
          <span className="font-mono text-ink">sn.ip</span> link with tracking +
          a QR code.
        </p>
      </div>

      {/* Shorten card */}
      <form
        onSubmit={onSubmit}
        className="rounded-[18px] border border-line bg-white p-[22px] shadow-elevated"
      >
        <label className="mb-2 block font-display text-[12.5px] font-semibold text-ink-2">
          Destination URL
        </label>
        <div className="focus-ring mb-4 flex h-[52px] items-center gap-[10px] rounded-[12px] border border-line-input bg-surface-alt px-[14px]">
          <GlobeIcon size={19} className="flex-none text-muted-3" />
          <input
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/your/really/long/link"
            className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none"
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1">
            <label className="mb-2 block font-display text-[12.5px] font-semibold text-ink-2">
              Short link{" "}
              <span className="font-medium text-muted-4">(optional)</span>
            </label>
            <div className="focus-ring flex h-[48px] items-stretch overflow-hidden rounded-[12px] border border-line-input bg-surface-alt">
              <div className="flex items-center border-r border-line-input bg-[#f1f2f5] px-[13px] font-mono text-[13.5px] font-medium text-ink-3">
                sn.ip /
              </div>
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="custom-name"
                className="min-w-0 flex-1 border-0 bg-transparent px-[13px] font-mono text-[14px] font-medium text-ink outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="h-[48px] rounded-[12px] bg-accent px-6 font-display text-[14.5px] font-semibold text-white shadow-btn-lg transition hover:brightness-[1.07]"
          >
            Shorten
          </button>
        </div>
      </form>

      <SuccessCard />

      {/* Recent links */}
      <div className="mt-[34px]">
        <div className="mb-3 font-display text-[13px] font-semibold tracking-[0.01em] text-muted-2">
          Recent links
        </div>
        <div className="flex flex-col gap-2">
          {recent.map((link) => (
            <RecentRow key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}
