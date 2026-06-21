import { useApp } from "../store/appContext";
import { GoogleIcon, LinkIcon } from "../components/icons";

function Field({ label, type = "text", placeholder }) {
  return (
    <div className="mb-[14px]">
      <label className="mb-[7px] block font-display text-[12px] font-semibold text-ink-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="focus-ring h-[46px] w-full rounded-[11px] border border-line-input bg-surface-alt px-[14px] text-[14px]"
      />
    </div>
  );
}

export default function AuthScreen() {
  const { authMode, setAuthMode, login } = useApp();
  const isSignup = authMode === "signup";

  const onSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="flex h-full w-full">
      {/* Left panel */}
      <div className="relative flex w-[46%] flex-none flex-col justify-between overflow-hidden bg-sidebar-bg p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_10%,rgba(59,108,255,.35),transparent_60%),radial-gradient(500px_400px_at_90%_90%,rgba(59,108,255,.18),transparent_60%)]" />
        <div className="relative flex items-center gap-[11px]">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent">
            <LinkIcon size={19} strokeWidth={2.1} stroke="#fff" />
          </div>
          <span className="font-display text-[21px] font-bold">Snip</span>
        </div>
        <div className="relative">
          <h2 className="mb-[14px] font-display text-[40px] font-bold leading-[1.08] -tracking-[0.025em]">
            Short links,
            <br />
            big signals.
          </h2>
          <p className="max-w-[380px] text-[16px] leading-[1.55] text-[#aeb4c2]">
            Shorten, brand, and track every link you share — with QR codes and
            analytics built in.
          </p>
          <div className="mt-[34px] flex gap-6">
            <div>
              <div className="font-display text-[24px] font-bold">2.4M+</div>
              <div className="text-[12.5px] text-muted-2">links shortened</div>
            </div>
            <div>
              <div className="font-display text-[24px] font-bold">180M+</div>
              <div className="text-[12.5px] text-muted-2">clicks tracked</div>
            </div>
          </div>
        </div>
        <div className="relative text-[12px] text-[#6b707b]">
          © 2026 Snip · Privacy · Terms
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center p-10">
        <form onSubmit={onSubmit} className="w-full max-w-[380px]">
          <h1 className="mb-[6px] font-display text-[27px] font-bold -tracking-[0.02em]">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-[26px] text-[14px] text-muted-2">
            {isSignup
              ? "Start shortening links in seconds."
              : "Log in to your Snip dashboard."}
          </p>

          {/* Tabs */}
          <div className="mb-[22px] flex gap-1 rounded-[11px] bg-[#f1f2f5] p-1">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 rounded-[8px] py-[9px] font-display text-[13px] font-semibold ${
                !isSignup
                  ? "bg-white text-ink shadow-[0_1px_3px_rgba(17,19,26,.12)]"
                  : "text-muted-2"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex-1 rounded-[8px] py-[9px] font-display text-[13px] font-semibold ${
                isSignup
                  ? "bg-white text-ink shadow-[0_1px_3px_rgba(17,19,26,.12)]"
                  : "text-muted-2"
              }`}
            >
              Sign up
            </button>
          </div>

          {isSignup && <Field label="Name" placeholder="Jane Rivera" />}
          <Field label="Email" placeholder="you@email.com" />
          <div className="mb-5">
            <label className="mb-[7px] block font-display text-[12px] font-semibold text-ink-3">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="focus-ring h-[46px] w-full rounded-[11px] border border-line-input bg-surface-alt px-[14px] text-[14px]"
            />
          </div>

          <button
            type="submit"
            className="mb-[14px] h-[48px] w-full rounded-[12px] bg-accent font-display text-[15px] font-semibold text-white shadow-btn-xl transition hover:brightness-[1.07]"
          >
            {isSignup ? "Create account" : "Log in"}
          </button>
          <button
            type="submit"
            className="flex h-[48px] w-full items-center justify-center gap-[9px] rounded-[12px] border border-line-input bg-white font-display text-[14px] font-semibold text-ink-2 transition hover:bg-[#f6f7f9]"
          >
            <GoogleIcon size={17} />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
