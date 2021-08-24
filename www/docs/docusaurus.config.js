const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

const path = require("path")
const docsPath = path.join(__dirname, "../../docs/content")

const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"
const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Medusa Commerce",
  tagline: "Explore and learn how to use Medusa",
  url: "https://docs.medusa-commerce.com",
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
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: "Medusa Commerce",
        src: "img/logo.svg",
        srcDark: "img/logo.svg",
      },
      items: [
        {
          type: "search",
          position: "left",
        },
        {
          type: "doc",
          docId: "tutorial/set-up-your-development-environment",
          position: "right",
          label: "Tutorial",
        },
        {
          href: `https://docs.medusa-commerce.com/api/store`,
          target: "_self",
          position: "right",
          label: "API Reference",
        },
        {
          className: "navbar-github-link",
          href: "https://github.com/medusajs/medusa/",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
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
              href: "https://discordapp.com/invite/medusajs",
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
    prism: {
      theme: darkCodeTheme,
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
