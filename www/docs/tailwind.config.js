import coreConfig from "../tailwind.config"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  // prefix: "tw-",
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../docs/content/**/*.{mdx,md}",
    "docusaurus.config.js",
    "sidebars.js",
  ],
  theme: {
    ...coreConfig.theme,
    extend: {
      ...coreConfig.theme.extend,
      screens: {
        ...coreConfig.theme.screens,
        xs: "576px",
        lg: "996px",
        xl: "1419px",
        xxl: "1440px",
      },
    },
  },
}
