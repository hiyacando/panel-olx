import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [],
};

export default config;
