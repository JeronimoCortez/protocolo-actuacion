/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-dm-serif-display)", "serif"],
      },
      keyframes: {
        emergencyPulse: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 oklch(0.5 0.25 25 / 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 14px oklch(0.5 0.25 25 / 0)",
          },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "emergency-pulse": "emergencyPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.2s ease",
      },
      boxShadow: {
        "action-red": "0 8px 24px -4px oklch(0.7 0.15 25 / 0.25)",
        "action-blue": "0 8px 24px -4px oklch(0.6 0.1 250 / 0.2)",
        "action-green": "0 8px 24px -4px oklch(0.6 0.12 150 / 0.2)",
      },
    },
  },
  plugins: [],
};