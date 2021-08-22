module.exports = {
  siteMetadata: {
    title: "Medusa",
    description: "Open-source headless commerce engine",
    author: "Medusa core team",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
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
      resolve: `gatsby-plugin-algolia-docsearch`,
      options: {
        appId: process.env.ALGOLIA_APP_ID || "temp",
        apiKey: process.env.ALGOLIA_API_KEY || "temp", // required
        indexName: "medusa-commerce", // required
        inputSelector: "#algolia-doc-search", // required
        debug: false, // (bool) Optional. Default `false`
      },
    },
    // `gatsby-plugin-preact`,
    // {
    //   resolve: `gatsby-source-openapi-aggregate`,
    //   options: {
    //     specs: [
    //       {
    //         name: "admin-spec",
    //         resolve: () =>
    //           fromJson(
    //             path.resolve(__dirname, "../../docs/api/admin-spec3.json")
    //           ),
    //       },
    //     ],
    //   },
    // },
  ],
}
