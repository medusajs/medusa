import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  prerequisitesLinkFixerPlugin,
  recmaInjectMdxDataPlugin,
  typeListLinkFixerPlugin,
  validateHighlightsPlugin,
  workflowDiagramLinkFixerPlugin,
} from "remark-rehype-plugins"

import bundleAnalyzer from "@next/bundle-analyzer"
import mdx from "@next/mdx"
import mdxPluginOptions from "./mdx-options.mjs"
import path from "node:path"
import { catchBadRedirects } from "build-scripts"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        brokenLinkCheckerPlugin,
        {
          rootBasePath: {
            default: "app",
            overrides: {
              "/references": "",
            },
          },
          hasGeneratedSlugs: true,
          crossProjects: {
            bloom: {
              projectPath: path.resolve("..", "bloom"),
            },
            docs: {
              projectPath: path.resolve("..", "book"),
            },
            ui: {
              projectPath: path.resolve("..", "ui"),
            },
            "user-guide": {
              projectPath: path.resolve("..", "user-guide"),
            },
            api: {
              projectPath: path.resolve("..", "api-reference"),
              skipSlugValidation: true,
            },
            cloud: {
              projectPath: path.resolve("..", "cloud"),
            },
          },
        },
      ],
      ...mdxPluginOptions.options.rehypePlugins,
      [validateHighlightsPlugin, { verbose: false }],
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
    recmaPlugins: [[recmaInjectMdxDataPlugin]],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui", "next-mdx-remote"],

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/resources",
  async redirects() {
    return catchBadRedirects([
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
      {
        source: "/deployment/admin/vercel",
        destination: "/deployment",
        permanent: true,
      },
      {
        source: "/recipes/integrate-ecommerce-stack",
        destination: "/recipes/erp",
        permanent: true,
      },
      {
        source: "/contribution-guidelines/:path",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/resources/contribution-guidelines/:path`,
        permanent: true,
      },
      {
        source: "/usage",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/resources/usage`,
        permanent: true,
      },
      {
        source: "/plugins",
        destination: "/integrations",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/recipes",
        permanent: true,
      },
      {
        source: "/references/medusa-config",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/learn/configurations/medusa-config`,
        permanent: true,
      },
      {
        source: "/troubleshooting/workflow-errors",
        destination: "/troubleshooting/workflow-errors/when-then",
        permanent: true,
      },
      {
        source: "/medusa-cli/commands/start-cluster",
        destination: "/medusa-cli/commands/start",
        permanent: true,
      },
      {
        source: "/architectural-modules/:path*",
        destination: "/infrastructure-modules/:path*",
        permanent: true,
      },
      {
        source: "/events-reference",
        destination: "/references/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/auth/events",
        destination: "/references/auth/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/cart/events",
        destination: "/references/cart/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/customer/events",
        destination: "/references/customer/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/fulfillment/events",
        destination: "/references/fulfillment/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/order/events",
        destination: "/references/order/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/payment/events",
        destination: "/references/payment/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/product/events",
        destination: "/references/product/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/region/events",
        destination: "/references/region/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/sales-channel/events",
        destination: "/references/sales-channel/events",
        permanent: true,
      },
      {
        source: "/commerce-modules/user/events",
        destination: "/references/user/events",
        permanent: true,
      },
      {
        source: "/storefront-development/cart",
        destination: "/storefront-development/cart/create",
        permanent: true,
      },
      {
        source: "/storefront-development/customer",
        destination: "/storefront-development/customer/register",
        permanent: true,
      },
      {
        source: "/storefront-development/products/categories",
        destination: "/storefront-development/products/categories/list",
        permanent: true,
      },
      {
        source: "/storefront-development/products/collections",
        destination: "/storefront-development/products/collections/list",
        permanent: true,
      },
      {
        source: "/storefront-development/products",
        destination: "/storefront-development/products/list",
        permanent: true,
      },
      {
        source: "/deployment/medusa-application/railway",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/cloud/comparison`,
        permanent: true,
      },
    ])
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/@medusajs/icons"],
  },
  outputFileTracingIncludes: {
    "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
    "/md\\-content/references/**": ["./references/**/*.mdx"],
  },
  experimental: {
    optimizePackageImports: ["@medusajs/icons", "@medusajs/ui", "elkjs"],
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/:path*/index.html.md",
          destination: "/md-content/:path*",
        },
        {
          source: "/:path*",
          has: [
            {
              type: "header",
              key: "Accept",
              value: ".*(text/markdown|text/plain).*",
            },
          ],
          destination: "/md-content/:path*",
        },
      ],
    }
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withMDX(withBundleAnalyzer(nextConfig))
