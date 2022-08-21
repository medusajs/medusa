module.exports = {
  siteMetadata: {
    title: "Medusa",
    description: "Open-source headless commerce engine",
    author: "Medusa core team",
    siteUrl: "https://docs.medusajs.com/api"
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-dark-mode`,
    {
      resolve: `gatsby-plugin-anchor-links`,
      options: {
        offset: -100,
        duration: 1000,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-plugin-emotion`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "store-api",
        path: `${__dirname}/../../docs/api/store-spec3.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "admin-api",
        path: `${__dirname}/../../docs/api/admin-spec3.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/../../docs/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../../docs/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              elements: [`h2`, `h3`, `h4`],
            },
          },
        ],
      },
    },
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["ALGOLIA_API_KEY", "ALGOLIA_APP_ID"],
      },
    },
    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        prodKey: process.env.SEGMENT_API_KEY,
        devKey: process.env.SEGMENT_API_KEY_DEV,
        trackPage: true,
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: '/api/sitemap'
      }
    },
    // `gatsby-plugin-preact`,
    // {
    //   resolve: `gatsby-source-openapi-aggregate`,
    //   options: {
    //     specs: [
    //       {
    //         name: "admin-spec",
    //         resolve: () =>
    //           fromJson(``
    //             path.resolve(__dirname, "../../docs/api/admin-spec3.json")
    //           ),
    //       },
    //     ],
    //   },
    // },
  ],
}
