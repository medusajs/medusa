require('dotenv').config();
const path = require("path")
const fs = require("fs")
const docsPath = path.join(__dirname, "../../docs/content")
const apisPath = path.join(__dirname, "../../docs/api")
const reverseSidebar = require('./src/utils/reverseSidebar')

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
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "medusajs",
  projectName: "medusajs/www",
  plugins: [
    [
      "docusaurus-plugin-segment",
      {
        apiKey: process.env.SEGMENT_API_KEY || "temp"
      }
    ],
    require.resolve("docusaurus-plugin-image-zoom"),
  ],
  themeConfig: {
    image: 'img/docs-banner.jpg',
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
    zoom: {
      selector: '.markdown :not(.no-zoom-img) > img:not(.no-zoom-img)'
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
          type: 'search',
          position: 'left',
        },
        {
          type: "docSidebar",
          sidebarId: "homepage",
          label: "Docs",
          position: "right"
        },
        {
          type: "docSidebar",
          sidebarId: "userGuideSidebar",
          label: "User Guide",
          position: "right"
        },
        {
          href: "/api/store",
          label: "Store API",
          prependBaseUrlToHref: true,
          target: '_blank',
          position: "right"
        },
        {
          href: "/api/admin",
          label: "Admin API",
          prependBaseUrlToHref: true,
          target: '_blank',
          position: "right"
        }
      ],
    },
    navbarActions: [
      {
        type: "link",
        href: "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
        title: "Report an Issue",
        icon: "report"
      }
    ],
    footer: {
      copyright: `© ${new Date().getFullYear()} Medusa, Inc. All rights reserved.`,
    },
    socialLinks: [
      {
        type: 'discord',
        href: 'https://discord.gg/medusajs'
      },
      {
        type: 'twitter',
        href: 'https://twitter.com/medusajs'
      },
      {
        type: 'linkedin',
        href: 'https://www.linkedin.com/company/medusajs'
      },
      {
        type: 'github',
        href: 'https://github.com/medusajs/medusa'
      }
    ],
    reportCodeLinkPrefix: 'https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml',
    footerFeedback: {
      event: 'survey'
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true
      }
    }
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
          // breadcrumbs: false,
          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            return reverseSidebar(sidebarItems, args.item);
          },
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
          primaryColorDark: '#161618',
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
