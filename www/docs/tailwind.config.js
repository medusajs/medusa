import coreConfig from "../tailwind.config"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  prefix: "tw-",
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../docs/content/**/*.{mdx,md}"],
  theme: {
    ...coreConfig.theme,
    extend: {
      ...coreConfig.theme.extend,
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
      },
    }
  }
}
