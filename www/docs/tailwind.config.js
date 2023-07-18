import coreConfig from "../tailwind.config"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  prefix: "tw-",
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../docs/content/**/*.{mdx,md}"],
}
