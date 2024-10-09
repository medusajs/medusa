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

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2/resources",
  async redirects() {
    return [
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
