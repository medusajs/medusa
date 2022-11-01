const path = require("path")
const fs = require("fs")
const docsPath = path.join(__dirname, "../../docs/content")
const apisPath = path.join(__dirname, "../../docs/api")

const algoliaAppId = process.env.ALGOLIA_APP_ID || "temp"
const algoliaApiKey = process.env.ALGOLIA_API_KEY || "temp"

const announcementBar = JSON.parse(fs.readFileSync('./announcement.json'))

/** @type {import('@docusaurus/types').DocusaurusConfig} */
const config = {
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
    [
      "docusaurus-plugin-segment",
      {
        apiKey: process.env.SEGMENT_API_KEY || "temp"
      }
    ]
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    algolia: {
      apiKey: algoliaApiKey,
      indexName: "medusa-commerce",
      placeholder: "Search docs...",
      appId: algoliaAppId,
      contextualSearch: false,
      externalUrlRegex: "https://medusajs.com"
    },
    prism: {
      defaultLanguage: "js",
      plugins: ["line-numbers", "show-language"],
      theme: require("./src/themes/medusaDocs"),
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: "Medusa",
        src: "img/logo.png",
        srcDark: "img/logo-dark.png"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          label: "Docs"
        },
        {
          type: "docSidebar",
          sidebarId: "userGuideSidebar",
          label: "User Guide"
        },
        {
          href: "/api/store",
          label: "Store API",
          prependBaseUrlToHref: true,
          target: '_blank'
        },
        {
          href: "/api/admin",
          label: "Admin API",
          prependBaseUrlToHref: true,
          target: '_blank'
        },
        {
          href: "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
          position: "right",
          label: "Report an Issue",
          className: "right-divider"
        },
      ],
    },
    footer: {
      links: [
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
            {
              label: "Integrations",
              href: "https://medusajs.notion.site/1a0ada9903874e0185d0b8ce0591b359?v=0631285851ba4021aa07c3b48dd4801a",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Medusa`,
    },
    sidebarFooter: [
      {
        href: "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
        label: 'Report an Issue',
        className: 'alert-icon',
      },
      {
        href: "https://medusajs.com/",
        label: 'Go to medusajs.com',
        className: 'topright-icon',
      },
    ],
    reportCodeLinkPrefix: 'https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml'
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/medusajs/medusa/edit/master/docs/content",
          path: docsPath,
          routeBasePath: "/",
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          showLastUpdateTime: true,
          breadcrumbs: false,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        },
        gtag: {
          trackingID: 'G-S7G7X3JYS3',
        },
      },
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: path.join(apisPath, 'store/openapi.yaml'),
            route: '/api/store',
            layout: {
              noFooter: true
            }
          },
          {
            spec: path.join(apisPath, 'admin/openapi.yaml'),
            route: '/api/admin',
            layout: {
              noFooter: true
            }
          }
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          primaryColorDark: '#242526',
          options: {
            disableSearch: true,
            nativeScrollbars: true,
            sortTagsAlphabetically: true,
            hideDownloadButton: true,
            expandResponses: "200,204",
            generatedPayloadSamplesMaxDepth: 4,
            showObjectSchemaExamples: true,
            requiredPropsFirst: true,
            hideRequestPayloadSample: true
          },
          theme: {
            sidebar: {
              width: '250px'
            }
          }
        }
      },
    ],
  ],
}

if (Object.keys(announcementBar).length) {
  config.themeConfig.announcementBar = announcementBar
}

module.exports = config
