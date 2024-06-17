import coreConfig from "tailwind"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  content: [
    ...coreConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...coreConfig.theme,
    extend: {
      ...coreConfig.theme.extend,
      container: {
        center: true,
        screens: {
          "2xl": "1400px",
        },
      },
    },
    backgroundImage: {
      ...coreConfig.theme.backgroundImage,
      "search-hit": "url('/images/search-hit-light.svg')",
      "search-hit-dark": "url('/images/search-hit.svg')",
      "search-arrow": "url('/images/search-hit-arrow-light.svg')",
      "search-arrow-dark": "url('/images/search-hit-arrow.svg')",
      "search-no-result": "url('/images/search-no-result-light.svg')",
      "search-no-result-dark": "url('/images/search-no-result.svg')",
      "magnifying-glass": "url('/images/magnifying-glass.svg')",
      "magnifying-glass-dark": "url('/images/magnifying-glass-dark.svg')",
    },
  },
}
