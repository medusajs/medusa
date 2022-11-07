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
    ],
    require.resolve("docusaurus-plugin-image-zoom")
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
      logo: {
        alt: "Medusa",
        src: "img/logo.png",
        srcDark: "img/logo-dark.png"
      },
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Get started',
              to: '/quickstart/quick-start'
            },
            {
              label: 'Docs',
              to: '/'
            },
            {
              label: 'Store API',
              to: '/api/store'
            },
            {
              label: 'Admin API',
              to: '/api/admin'
            }
          ]
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Careers',
              href: 'https://medusajs.notion.site/Careers-at-Medusa-f986a1d41eb146d888f9590a360547d1'
            },
            {
              label: 'Pricing',
              href: 'https://medusajs.com/pricing/'
            },
            {
              label: 'Press Kit',
              href: 'https://medusajs.notion.site/Media-Kit-9d885bb679674b458bca316f841322b6'
            },
            {
              label: 'About',
              href: 'https://medusajs.notion.site/'
            },
            {
              label: 'Blog',
              href: 'https://medusajs.com/blog'
            },
            {
              label: 'Contact',
              href: 'https://medusajs.com/contact-us/'
            }
          ]
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/medusa-commerce",
            },
            {
              label: "Discussions",
              href: "https://github.com/medusajs/medusa/discussions",
            },
            {
              label: "Discord",
              href: "https://discord.gg/medusajs",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Medusa`,
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
        type: 'github',
        href: 'https://github.com/medusajs/medusa'
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
