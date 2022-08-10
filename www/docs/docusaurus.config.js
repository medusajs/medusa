const path = require("path")
const docsPath = path.join(__dirname, "../../docs/content")
const apisPath = path.join(__dirname, "../../docs/api")

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
        alt: "Medusa",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
        width: 100
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          label: "Docs"
        },
        {
          type: 'dropdown',
          label: 'REST API Reference',
          items: [
            {
              type: 'html',
              value: `
              <a href="/api/store" target="_blank" rel="noopener noreferrer" class="dropdown__link">Store
                <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module">
                  <path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path>
                </svg>
              </a>`
            },
            {
              type: 'html',
              value: `
              <a href="/api/admin" target="_blank" rel="noopener noreferrer" class="dropdown__link">Admin
                <svg width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module">
                  <path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path>
                </svg>
              </a>`
            },
          ],
        },
        {
          type: 'dropdown',
          label: 'References',
          items: [
            {
              to: "cli/reference",
              label: "CLI Reference",
            },
            {
              to: "advanced/backend/subscribers/events-list",
              label: "Events Reference",
            },
            {
              type: "docSidebar",
              sidebarId: "jsClientSidebar",
              label: "JS Client Reference",
            },
            {
              type: "docSidebar",
              sidebarId: "servicesSidebar",
              label: "Services Reference",
            },
          ]
        },
        {
          href: "https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml",
          position: 'right',
          label: 'Report an Issue'
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
          editUrl: "https://github.com/medusajs/medusa/edit/master/docs/content",
          path: docsPath,
          routeBasePath: "/",
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
          ],
          showLastUpdateTime: true
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
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
            requiredPropsFirst: true
          }
        }
      },
    ],
  ],
}
