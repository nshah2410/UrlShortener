import { useApp } from "../store/appContext";
import { PlusIcon } from "./icons";

const TITLES = {
  create: ["Create link", "Shorten a new URL"],
  links: ["My links", "All your short links in one place"],
  analytics: ["Analytics", "Performance for your links"],
  qr: ["QR codes", "Generate & download QR codes"],
  domains: ["Domains", "Manage your branded short domains"],
  settings: ["Settings", "Account & link preferences"],
};

export default function Header() {
  const { screen, go } = useApp();
  const [title, subtitle] = TITLES[screen] || ["", ""];

  return (
    <header className="flex h-[64px] flex-none items-center justify-between border-b border-line bg-white px-[30px]">
      <div>
        <h1 className="font-display text-[18px] font-bold -tracking-[0.01em]">
          {title}
        </h1>
        <p className="mt-[2px] text-[12.5px] text-muted-2">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => go("create")}
          className="flex items-center gap-[7px] rounded-[10px] bg-accent px-[15px] py-[9px] font-display text-[13px] font-semibold text-white shadow-btn transition hover:brightness-[1.07]"
        >
          <PlusIcon size={15} stroke="#fff" />
          New link
        </button>
      </div>
    </header>
  );
}
