const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const path = require("path");
const docsPath = path.join(__dirname, "../../docs/content");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Medusa Commerce",
  tagline: "Explore and learn how to use Medusa",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "https://laughing-cori-67ba88.netlify.app",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "medusajs", // Usually your GitHub org/user name.
  projectName: "medusajs/www", // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: "YOUR_API_KEY",
      indexName: "YOUR_INDEX_NAME",
      placeholder: "Search docs...",

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: see doc section below
      appId: "YOUR_APP_ID",

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
    navbar: {
      hideOnScroll: true,
      // title: "Medusa Docs",
      logo: {
        alt: "Medusa Commerce",
        src: "img/logo.svg",
        srcDark: "img/logo_dark.svg",
      },
      items: [
        {
          type: "search",
          position: "left",
        },
        {
          type: "doc",
          docId: "tutorials/overview",
          position: "right",
          label: "Tutorial",
        },
        {
          href: "http://localhost:8000/api/store",
          position: "right",
          label: "API Reference",
        },
        // { to: "/blog", label: "Blog", position: "left" },
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
              label: "Tutorials",
              to: "/tutorials/overview",
            },
            {
              label: "Guides",
              to: "/guides/overview",
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
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Medusa Commerce`,
    },
    prism: {
      theme: darkCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/medusajs/medusa/edit/master/www/",
          path: docsPath,
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/edit/master/website/blog/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
