import { useApp } from "../store/appContext";
import { ChevronDownIcon } from "../components/icons";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="flex h-[27px] w-[46px] rounded-full p-[3px] transition-colors"
      style={{
        background: on ? "#3b6cff" : "#d6d9e0",
        justifyContent: on ? "flex-end" : "flex-start",
      }}
    >
      <span className="h-[21px] w-[21px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)]" />
    </button>
  );
}

function PrefRow({ title, desc, children, border = true }) {
  return (
    <div
      className={`flex items-center justify-between py-[14px] ${
        border ? "border-b border-line-faint" : ""
      }`}
    >
      <div>
        <div className="font-display text-[13.5px] font-semibold">{title}</div>
        <div className="mt-[2px] text-[12px] text-muted-3">{desc}</div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsScreen() {
  const { utm, cloak, toggleUtm, toggleCloak, logout } = useApp();

  return (
    <div className="mx-auto max-w-[720px] animate-fadeUp p-[30px]">
      {/* Profile */}
      <div className="mb-[18px] rounded-[16px] border border-line bg-white p-[22px]">
        <div className="mb-[18px] font-display text-[15px] font-semibold">
          Profile
        </div>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff8a5c,#ff4d8d)] font-display text-[22px] font-bold text-white">
            JR
          </div>
          <button className="rounded-[10px] border border-line-input bg-white px-[15px] py-[9px] font-display text-[13px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]">
            Change photo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-[14px]">
          <div>
            <label className="mb-[7px] block font-display text-[12px] font-semibold text-ink-3">
              Name
            </label>
            <input
              defaultValue="Jane Rivera"
              className="focus-ring h-[44px] w-full rounded-[10px] border border-line-input bg-surface-alt px-[13px] text-[14px]"
            />
          </div>
          <div>
            <label className="mb-[7px] block font-display text-[12px] font-semibold text-ink-3">
              Email
            </label>
            <input
              defaultValue="jane@rivera.studio"
              className="focus-ring h-[44px] w-full rounded-[10px] border border-line-input bg-surface-alt px-[13px] text-[14px]"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-[18px] rounded-[16px] border border-line bg-white p-[22px]">
        <div className="mb-[6px] font-display text-[15px] font-semibold">
          Preferences
        </div>
        <PrefRow title="Default domain" desc="Used for new short links">
          <div className="flex items-center gap-[7px] rounded-[10px] border border-line-input px-[13px] py-[9px] font-mono text-[13px] font-medium">
            sn.ip
            <ChevronDownIcon size={14} className="text-muted-3" />
          </div>
        </PrefRow>
        <PrefRow
          title="Auto-append UTM tags"
          desc="Add campaign tracking to destinations"
        >
          <Toggle on={utm} onClick={toggleUtm} />
        </PrefRow>
        <PrefRow
          title="Link cloaking"
          desc="Hide the destination behind your domain"
          border={false}
        >
          <Toggle on={cloak} onClick={toggleCloak} />
        </PrefRow>
      </div>

      <button
        onClick={logout}
        className="rounded-[11px] border border-[#f2c4c4] bg-white px-[18px] py-[11px] font-display text-[13px] font-semibold text-danger transition hover:bg-[#fdf3f3]"
      >
        Sign out
      </button>
    </div>
  );
}
