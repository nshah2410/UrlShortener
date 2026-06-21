import { useApp } from "../store/appContext";
import { GlobeIcon } from "../components/icons";

export default function DomainsScreen() {
  const { links } = useApp();

  const domains = [
    {
      name: "sn.ip",
      status: "Default",
      badgeFg: "#5b606b",
      badgeBg: "#f1f2f5",
      meta: `System domain · ${links.length} links`,
      action: "Manage",
    },
    {
      name: "go.rivera.studio",
      status: "Active",
      badgeFg: "#15a06b",
      badgeBg: "#e7f7ef",
      meta: "Verified · SSL active · 312 links",
      action: "Manage",
    },
    {
      name: "links.acme.io",
      status: "Pending",
      badgeFg: "#b7791f",
      badgeBg: "#fdf4e3",
      meta: "Add a CNAME record pointing to cname.sn.ip",
      action: "Verify",
    },
  ];

  return (
    <div className="mx-auto max-w-[880px] animate-fadeUp p-[30px]">
      {/* Add domain */}
      <div className="mb-[18px] rounded-[16px] border border-line bg-white p-5">
        <div className="mb-[5px] font-display text-[14px] font-semibold">
          Add a custom domain
        </div>
        <div className="mb-[14px] text-[13px] text-muted-2">
          Use your own branded short domain like{" "}
          <span className="font-mono text-ink">go.yourbrand.com</span>.
        </div>
        <div className="flex gap-[10px]">
          <div className="focus-ring flex h-[46px] flex-1 items-center rounded-[11px] border border-line-input bg-surface-alt px-[14px]">
            <input
              placeholder="links.yourbrand.com"
              className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[14px] font-medium outline-none"
            />
          </div>
          <button className="rounded-[11px] bg-accent px-[22px] font-display text-[13.5px] font-semibold text-white transition hover:brightness-[1.07]">
            Add domain
          </button>
        </div>
      </div>

      {/* Domain list */}
      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        {domains.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-[14px] border-b border-line-faint px-5 py-4"
          >
            <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-[#f1f3f9]">
              <GlobeIcon size={19} className="text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[9px]">
                <span className="font-mono text-[14.5px] font-semibold text-ink">
                  {d.name}
                </span>
                <span
                  className="rounded-full px-[9px] py-[3px] font-display text-[11px] font-semibold"
                  style={{ color: d.badgeFg, background: d.badgeBg }}
                >
                  {d.status}
                </span>
              </div>
              <div className="mt-[3px] text-[12px] text-muted-3">{d.meta}</div>
            </div>
            <button className="rounded-[9px] border border-line-input bg-white px-[14px] py-2 font-display text-[12.5px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]">
              {d.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
