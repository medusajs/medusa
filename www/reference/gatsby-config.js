/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

// const fs = require("fs")
// const path = require("path")

// const fromJson = filePath => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         reject(err)
//         return
//       }

//       resolve(data)
//     })
//   })
// }

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
        offset: -500,
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
