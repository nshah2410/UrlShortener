/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#3b6cff",
        ink: { DEFAULT: "#11131a", 2: "#3a3f4a", 3: "#5b606b" },
        muted: { DEFAULT: "#70757f", 2: "#8a90a0", 3: "#9aa0ab", 4: "#aab0bb" },
        appbg: "#f4f5f7",
        surface: { DEFAULT: "#ffffff", alt: "#fbfbfc", alt2: "#fafbfc" },
        line: { DEFAULT: "#e9eaef", input: "#e3e5ec", faint: "#f2f3f6" },
        sidebar: {
          bg: "#0e1119",
          fg: "#98a0b2",
          active: "rgba(255,255,255,0.09)",
        },
        success: { DEFAULT: "#15a06b", bar: "#15b87f", bg: "#e7f7ef" },
        warn: { DEFAULT: "#b7791f", bg: "#fdf4e3" },
        danger: "#d24a4a",
        chart: { teal: "#15b87f", violet: "#6b5cff", ink: "#11131a" },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: [
          "system-ui",
          "-apple-system",
          "'Segoe UI'",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,19,26,.04)",
        elevated:
          "0 1px 2px rgba(17,19,26,.04), 0 18px 40px -28px rgba(17,19,26,.25)",
        btn: "0 4px 12px -4px rgba(59,108,255,.55)",
        "btn-lg": "0 6px 16px -6px rgba(59,108,255,.6)",
        "btn-xl": "0 8px 18px -8px rgba(59,108,255,.6)",
        logo: "0 4px 10px -3px rgba(59,108,255,.6)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        pop: {
          from: { opacity: "0", transform: "scale(.96)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        fadeUp: "fadeUp .4s ease both",
        pop: "pop .3s ease both",
      },
    },
  },
  plugins: [],
};
