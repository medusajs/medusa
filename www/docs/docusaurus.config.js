const path = require("path")
const docsPath = path.join(__dirname, "../../docs/content")

const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"
const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Medusa Commerce",
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
    disableSwitch: true,
    algolia: {
      apiKey: algoliaApiKey,
      indexName: "medusa-commerce",
      placeholder: "Search docs...",
      appId: algoliaAppId,
    },
    prism: {
      defaultLanguage: "js",
      plugins: ["line-numbers", "show-language"],
      theme: require("@kiwicopple/prism-react-renderer/themes/vsDark"),
      darkTheme: require("@kiwicopple/prism-react-renderer/themes/vsDark"),
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: "Medusa Commerce",
        src: "img/logo.svg",
        srcDark: "img/logo.svg",
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
              label: "Contact",
              href: "https://medusa-commere.com",
            },
            {
              label: "Privacy & Terms",
              href: "https://medusa-commere.com",
            },
            {
              label: "GitHub",
              href: "https://github.com/medusajs/medusa",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Medusa Commerce`,
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
