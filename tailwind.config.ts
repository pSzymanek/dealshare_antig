import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001F4D",
        ink: "#002B5C",
        electric: "#005BFF",
        teal: "#00B8B8",
        cyan: "#00D1D1",
        mist: "#F3F8FC"
      },
      boxShadow: {
        glow: "0 22px 80px rgba(0, 91, 255, 0.18)",
        card: "0 18px 55px rgba(0, 31, 77, 0.10)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "deal-gradient": "linear-gradient(135deg, #005BFF 0%, #00B8B8 100%)",
        "navy-gradient": "radial-gradient(circle at 20% 20%, rgba(0, 209, 209, 0.18), transparent 35%), linear-gradient(135deg, #001F4D 0%, #002B5C 100%)"
      }
    }
  },
  plugins: []
};

export default config;
