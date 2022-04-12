const path = require("path")
const docsPath = path.join(__dirname, "../../docs/content")

const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"
const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Medusa",
  tagline: "Explore and learn how to use Medusa",
  url: "https://docs.medusajs.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "medusajs",
  projectName: "medusajs/www",
  plugins: [
    [
      "docusaurus2-dotenv",
      {
        path: "./.env", // The path to your environment variables.
        systemvars: true, // Set to true if you would rather load all system variables as well (useful for CI purposes)
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    algolia: {
      apiKey: algoliaApiKey,
      indexName: "medusa-commerce",
      placeholder: "Search docs...",
      appId: algoliaAppId,
      contextualSearch: false,
    },
    prism: {
      defaultLanguage: "js",
      plugins: ["line-numbers", "show-language"],
      theme: require("prism-react-renderer/themes/vsDark"),
      darkTheme: require("prism-react-renderer/themes/vsDark"),
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: "Medusa Commerce",
        src: "img/logo.svg",
        srcDark: "img/logo.svg",
        width: 100
      },
      items: [
        {
          href: "https://docs.medusajs.com",
          label: "Introduction",
        },
        {
          href: `https://docs.medusajs.com/api/store`,
          target: "_self",
          label: "API Reference",
        },
        {
          href: "https://github.com/medusajs/medusa",
          className: "navbar-github-link",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/tutorial/set-up-your-development-environment",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/medusa-commerce",
            },
            {
              label: "Discord",
              href: "https://discord.gg/medusajs",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/medusajs",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Medusa Home",
              href: "https://medusajs.com",
            },
            {
              label: "Contact",
              href: "https://ky5eo2x1u81.typeform.com/get-in-touch",
            },
            {
              label: "GitHub",
              href: "https://github.com/medusajs/medusa",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Medusa`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/medusajs/medusa/edit/master/www/",
          path: docsPath,
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
}
