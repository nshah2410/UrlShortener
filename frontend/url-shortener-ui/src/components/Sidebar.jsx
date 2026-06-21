import { useApp } from "../store/appContext";
import {
  BarChartIcon,
  GlobeIcon,
  LinkIcon,
  ListIcon,
  QrIcon,
  SignOutIcon,
  SlidersIcon,
} from "./icons";

const NAV_ITEMS = [
  { id: "create", label: "Create link", Icon: LinkIcon },
  { id: "links", label: "My links", Icon: ListIcon },
  { id: "analytics", label: "Analytics", Icon: BarChartIcon },
  { id: "qr", label: "QR codes", Icon: QrIcon },
  { id: "domains", label: "Domains", Icon: GlobeIcon },
  { id: "settings", label: "Settings", Icon: SlidersIcon },
];

function NavButton({ item, active, onClick }) {
  const { Icon, label } = item;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-[11px] rounded-[10px] px-[11px] py-[9px] text-left font-display text-[13.5px] font-semibold leading-none transition-colors ${
        active
          ? "bg-sidebar-active text-white"
          : "text-sidebar-fg hover:bg-white/[0.06]"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { screen, go, logout } = useApp();

  return (
    <aside className="flex w-[250px] flex-none flex-col border-r border-white/[0.06] bg-sidebar-bg px-[14px] pb-4 pt-[18px]">
      {/* Logo */}
      <div className="flex items-center gap-[10px] px-2 pb-[18px] pt-[6px]">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-accent shadow-logo">
          <LinkIcon size={17} strokeWidth={2.1} stroke="#fff" />
        </div>
        <span className="font-display text-[19px] font-bold -tracking-[0.01em] text-white">
          Snip
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-[2px]">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={screen === item.id}
            onClick={() => go(item.id)}
          />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Upgrade card */}
      <div className="mb-3 rounded-[13px] border border-white/[0.08] bg-white/[0.05] p-[14px]">
        <div className="mb-[9px] flex items-baseline justify-between">
          <span className="font-display text-[12.5px] font-semibold text-white">
            Free plan
          </span>
          <span className="font-mono text-[11.5px] font-medium text-sidebar-fg">
            12 / 50
          </span>
        </div>
        <div className="mb-[11px] h-[6px] overflow-hidden rounded-full bg-[rgba(125,130,145,.25)]">
          <div className="h-full w-[24%] rounded-full bg-accent" />
        </div>
        <button className="w-full rounded-[8px] bg-accent py-2 font-display text-[12.5px] font-semibold text-white transition hover:brightness-110">
          Upgrade to Pro
        </button>
      </div>

      {/* User button */}
      <button
        onClick={logout}
        className="flex w-full items-center gap-[10px] rounded-[11px] p-2 text-left transition hover:bg-[rgba(125,130,145,.12)]"
      >
        <div className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff8a5c,#ff4d8d)] font-display text-[12px] font-semibold text-white">
          JR
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[12.5px] font-semibold text-white">
            Jane Rivera
          </div>
          <div className="truncate text-[11px] text-sidebar-fg">
            jane@rivera.studio
          </div>
        </div>
        <SignOutIcon size={15} className="flex-none text-sidebar-fg" />
      </button>
    </aside>
  );
}
