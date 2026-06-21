// Inline stroke icons ported from the design prototype.
// Each accepts standard svg props (size via width/height, color via stroke).

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LinkIcon({ size = 18, strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
    </svg>
  );
}

export function ListIcon({ size = 18, strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BarChartIcon({ size = 18, strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M4 19h16" />
      <path d="M7.5 19v-5" />
      <path d="M12 19v-9" />
      <path d="M16.5 19v-13" />
    </svg>
  );
}

export function QrIcon({ size = 18, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" />
      <path d="M14.5 14.5h2.5v2.5M20.5 14.5v6h-6v-2.5" />
    </svg>
  );
}

export function GlobeIcon({ size = 18, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.5 2.6 15 0 18M12 3c-2.6 2.5-2.6 15 0 18" />
    </svg>
  );
}

export function SlidersIcon({ size = 18, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <rect
        x="13"
        y="6"
        width="4"
        height="4"
        rx="1.3"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="7"
        y="14"
        width="4"
        height="4"
        rx="1.3"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function CopyIcon({ size = 15, strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function CheckIcon({ size = 15, strokeWidth = 2.4, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

export function SearchIcon({ size = 17, strokeWidth = 2, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.4-3.4" />
    </svg>
  );
}

export function PlusIcon({ size = 15, strokeWidth = 2.4, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function FilterIcon({ size = 15, strokeWidth = 1.9, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14, strokeWidth = 2.2, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SignOutIcon({ size = 15, strokeWidth = 2, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      {...base}
      {...rest}
    >
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export function GoogleIcon({ size = 17, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
      <path
        fill="#4285F4"
        d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.8z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.2-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 12 1 11 11 0 0 0 2.3 7.4L6 10.2c.8-2.5 3.2-4.4 6-4.4z"
      />
    </svg>
  );
}
