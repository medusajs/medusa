import mdx from "@next/mdx"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  prerequisitesLinkFixerPlugin,
  typeListLinkFixerPlugin,
  workflowDiagramLinkFixerPlugin,
} from "remark-rehype-plugins"
import mdxPluginOptions from "./mdx-options.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      ...mdxPluginOptions.options.rehypePlugins,
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [typeListLinkFixerPlugin],
      [
        workflowDiagramLinkFixerPlugin,
        {
          checkLinksType: "value",
        },
      ],
      [
        prerequisitesLinkFixerPlugin,
        {
          checkLinksType: "value",
        },
      ],
    ],
    remarkPlugins: mdxPluginOptions.options.remarkPlugins,
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/resources",
  async redirects() {
    return [
      {
        source: "/commerce-modules/order/relations-to-other-modules",
        destination: "/commerce-modules/order/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/payment/relations-to-other-modules",
        destination: "/commerce-modules/payment/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/api-key/relations-to-other-modules",
        destination: "/commerce-modules/api-key/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/cart/relations-to-other-modules",
        destination: "/commerce-modules/cart/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/fulfillment/relations-to-other-modules",
        destination: "/commerce-modules/fulfillment/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/inventory/relations-to-other-modules",
        destination: "/commerce-modules/inventory/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/region/relations-to-other-modules",
        destination: "/commerce-modules/region/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/sales-channel/relations-to-other-modules",
        destination: "/commerce-modules/sales-channel/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/stock-location/relations-to-other-modules",
        destination: "/commerce-modules/stock-location/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/pricing/relations-to-other-modules",
        destination: "/commerce-modules/pricing/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/product/relations-to-other-modules",
        destination: "/commerce-modules/product/links-to-other-modules",
        permanent: true,
      },
      {
        source: "/commerce-modules/promotion/relations-to-other-modules",
        destination: "/commerce-modules/promotion/links-to-other-modules",
        permanent: true,
      },
    ]
  },
  // Redirects shouldn't be necessary anymore since we have remark / rehype
  // plugins that fix links. But leaving this here in case we need it again.
  // async redirects() {
  //   // redirect original file paths to the rewrite
  //   return slugChanges.map((item) => ({
  //     source: item.origSlug,
  //     destination: item.newSlug,
  //     permanent: true,
  //   }))
  // },
}

export default withMDX(nextConfig)
