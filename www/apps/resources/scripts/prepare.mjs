import {
  generateEditedDates,
  generateLlmsIndex,
  generateSitemapUrls,
  getMdxPagesLlmsLinks,
  generateSplitSidebars,
  copyMdxToPublic,
} from "build-scripts"
import { main as generateSlugChanges } from "./generate-slug-changes.mjs"
import { main as generateFilesMap } from "./generate-files-map.mjs"
import { sidebar } from "../sidebar.mjs"
import path from "path"

const referencePaths = [
  "/references/file-provider-module",
  "/references/file-service",
  "/references/locking-module-provider",
  "/references/locking-service",
  "/references/notification-provider-module",
  "/references/notification-service",
  "/references/event-service",
  "/references/cache-service",
  "/references/caching-module-provider",
  "/references/caching-service",
  "/references/auth/provider",
  "/references/fulfillment/provider",
  "/references/tax/provider",
  "/references/payment/provider",
]

async function main() {
  await generateSplitSidebars({
    sidebars: sidebar,
  })
  await generateSlugChanges()
  await generateFilesMap()
  await generateEditedDates()
  await generateSitemapUrls({
    extraPaths: referencePaths,
  })
  await generateLlmsIndex({
    title: "Medusa Development Resources",
    description:
      "Guides, recipes, tutorials, and references for Commerce Modules, Infrastructure Modules, integrations, storefront development, and Medusa's tools.",
    sections: [
      {
        title: "Pages",
        links: getMdxPagesLlmsLinks({
          baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${process.env.NEXT_PUBLIC_BASE_PATH || "/resources"}`,
          extraPaths: referencePaths,
        }),
      },
    ],
  })
  if (process.env.CLOUDFLARE_ENV) {
    await copyMdxToPublic({
      srcDir: path.join(process.cwd(), "app"),
      destDir: path.join(process.cwd(), "public", "raw-mdx"),
    })
  }
}

void main()
