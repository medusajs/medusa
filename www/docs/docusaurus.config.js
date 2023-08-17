/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config()
const fs = require("fs")
const reverseSidebar = require("./src/utils/reverseSidebar")

const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"
const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"

const announcementBar = JSON.parse(fs.readFileSync("./announcement.json"))

/** @type {import('@medusajs/docs').MedusaDocusaurusConfig} */
const config = {
  title: "Medusa",
  tagline: "Explore and learn how to use Medusa",
  url: "https://docs.medusajs.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "medusajs",
  projectName: "medusajs/www",
  plugins: [
    [
      "docusaurus-plugin-segment",
      {
        apiKey: process.env.SEGMENT_API_KEY || "temp",
      },
    ],
    require.resolve("docusaurus-plugin-image-zoom"),
    async function tailwindPlugin() {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"))
          postcssOptions.plugins.push(require("autoprefixer"))
          return postcssOptions
        },
      }
    },
  ],
  themeConfig: {
    image: "img/docs-meta.jpg",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: {
      apiKey: algoliaApiKey,
      indexName: "medusa-commerce",
      placeholder: "Search docs...",
      appId: algoliaAppId,
      contextualSearch: false,
      externalUrlRegex: "https://medusajs.com,https://docs.medusajs.com/api/",
      searchParameters: {
        tagFilters: "-reference",
      },
    },
    prism: {
      defaultLanguage: "js",
      plugins: ["line-numbers", "show-language"],
      theme: require("./src/themes/medusaDocs"),
    },
    zoom: {
      selector: ".markdown :not(.no-zoom-img) > img:not(.no-zoom-img)",
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: "Medusa",
        src: "img/logo-icon.png",
        srcDark: "img/logo-icon-dark.png",
        width: 20,
        height: 20,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "homepage",
          label: "Docs",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "userGuideSidebar",
          label: "User Guide",
          position: "left",
        },
        {
          href: `${process.env.API_URL}/api/store`,
          label: "Store API",
          prependBaseUrlToHref: true,
          target: "_blank",
          position: "left",
        },
        {
          href: `${process.env.API_URL}/api/admin`,
          label: "Admin API",
          prependBaseUrlToHref: true,
          target: "_blank",
          position: "left",
        },
        {
          href: `${process.env.API_URL}/ui`,
          label: "UI",
          prependBaseUrlToHref: true,
          target: "_blank",
          position: "left",
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    navbarActions: [
      {
        type: "link",
        href: "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
        label: "Report an Issue",
        className: "btn-secondary max-[1014px]:hidden",
      },
    ],
    mobileLogo: {
      alt: "Medusa",
      src: "img/logo-mobile.png",
      srcDark: "img/logo-mobile-dark.png",
      width: 82,
      height: 20,
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Medusa, Inc. All rights reserved.`,
    },
    socialLinks: [
      {
        type: "discord",
        href: "https://discord.gg/medusajs",
      },
      {
        type: "twitter",
        href: "https://twitter.com/medusajs",
      },
      {
        type: "linkedin",
        href: "https://www.linkedin.com/company/medusajs",
      },
      {
        type: "github",
        href: "https://github.com/medusajs/medusa",
      },
    ],
    reportCodeLinkPrefix:
      "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
    footerFeedback: {
      event: "survey",
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    cloudinaryConfig: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
      flags: ["fl_lossy", "f_auto"],
      resize: {
        action: "pad",
        aspectRatio: "16:9",
      },
      roundCorners: 16,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/medusajs/medusa/edit/develop/www/docs/content",
          path: "content",
          routeBasePath: "/",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          showLastUpdateTime: true,
          // breadcrumbs: false,
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args)
            return reverseSidebar(sidebarItems, args.item)
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-S7G7X3JYS3",
        },
        sitemap: {
          filename: "sitemap-docs.xml",
        },
      },
    ],
  ],
}

if (Object.keys(announcementBar).length) {
  config.themeConfig.announcementBar = announcementBar
}

module.exports = config
