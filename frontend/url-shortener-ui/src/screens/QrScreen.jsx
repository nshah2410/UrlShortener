import { useApp } from "../store/appContext";
import QrCode from "../components/QrCode";
import { PlusIcon } from "../components/icons";
import { fullUrl } from "../lib/helpers";

const SWATCHES = ["#11131a", "#3b6cff", "#15b87f", "#7c3aed", "#ef4444"];

export default function QrScreen() {
  const { links, selectedLinkId, setSelectedLinkId, qrColor, setQrColor } =
    useApp();
  const selLink = links.find((l) => l.id === selectedLinkId) || links[0];
  const full = fullUrl(selLink);

  return (
    <div className="mx-auto max-w-[1000px] animate-fadeUp p-[30px]">
      <div className="grid grid-cols-[340px_1fr] items-start gap-[22px]">
        {/* Left: preview + downloads */}
        <div className="rounded-[18px] border border-line bg-white p-6 text-center">
          <div className="mx-auto mb-4 h-[240px] w-[240px] overflow-hidden rounded-[14px] border border-[#eef0f3] bg-white p-[14px]">
            <QrCode value={"https://" + full} color={qrColor} />
          </div>
          <div className="mb-[18px] font-mono text-[15px] font-semibold text-ink">
            {full}
          </div>
          <div className="flex gap-[10px]">
            <button className="flex-1 rounded-[11px] bg-accent py-[11px] font-display text-[13px] font-semibold text-white transition hover:brightness-[1.07]">
              Download PNG
            </button>
            <button className="flex-1 rounded-[11px] border border-line-input bg-white py-[11px] font-display text-[13px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]">
              SVG
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[18px]">
          {/* Pattern color + logo */}
          <div className="rounded-[16px] border border-line bg-white p-5">
            <div className="mb-[14px] font-display text-[14px] font-semibold">
              Pattern color
            </div>
            <div className="mb-[22px] flex gap-[10px]">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => setQrColor(c)}
                  aria-label={`Set QR color ${c}`}
                  className="h-[42px] w-[42px] rounded-[11px] shadow-[0_0_0_1px_#e6e8ee]"
                  style={{
                    background: c,
                    border: `3px solid ${qrColor === c ? "#fff" : "transparent"}`,
                  }}
                />
              ))}
            </div>
            <div className="mb-3 font-display text-[14px] font-semibold">
              Add a center logo
            </div>
            <div className="flex items-center gap-[13px] rounded-[12px] border-[1.5px] border-dashed border-[#d6d9e0] bg-surface-alt p-[14px]">
              <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[10px] bg-[repeating-linear-gradient(45deg,#eef0f3,#eef0f3_6px,#f7f8fa_6px,#f7f8fa_12px)]">
                <PlusIcon size={18} strokeWidth={1.8} className="text-muted-4" />
              </div>
              <div className="flex-1">
                <div className="font-display text-[13px] font-semibold text-ink-2">
                  Drop a logo
                </div>
                <div className="font-mono text-[11.5px] text-muted-3">
                  PNG · SVG · 1:1 recommended
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="rounded-[16px] border border-line bg-white p-5">
            <div className="mb-[14px] font-display text-[14px] font-semibold">
              Your codes
            </div>
            <div className="grid grid-cols-4 gap-3">
              {links.map((l) => {
                const lf = fullUrl(l);
                const selected = l.id === selectedLinkId;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLinkId(l.id)}
                    className="flex flex-col items-center gap-[7px] rounded-[12px] border bg-white p-[10px] transition hover:border-accent"
                    style={{
                      borderColor: selected ? "#3b6cff" : "#eef0f3",
                    }}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-[7px]">
                      <QrCode value={"https://" + lf} color="#11131a" />
                    </div>
                    <span className="max-w-full truncate font-mono text-[10.5px] font-medium text-muted">
                      {lf}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
