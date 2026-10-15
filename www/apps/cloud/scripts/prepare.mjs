import {
  generateEditedDates,
  generateLlmsIndex,
  generateSidebar,
  generateSitemapUrls,
  getMdxPagesLlmsLinks,
  copyMdxToPublic,
} from "build-scripts"
import { sidebar } from "../sidebar.mjs"
import { generateChangelogManifest } from "./generate-changelog-manifest.mjs"
import path from "path"

async function main() {
  await generateSidebar(sidebar)
  await generateEditedDates()
  await generateSitemapUrls()
  await generateLlmsIndex({
    title: "Medusa Cloud Documentation",
    description:
      "Documentation for Medusa Cloud, the managed platform for deploying, hosting, and operating Medusa applications.",
    sections: [
      {
        title: "Pages",
        links: getMdxPagesLlmsLinks({
          baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${process.env.NEXT_PUBLIC_BASE_PATH || "/cloud"}`,
        }),
      },
    ],
  })
  await generateChangelogManifest()
  if (process.env.CLOUDFLARE_ENV) {
    await copyMdxToPublic({
      srcDir: path.join(process.cwd(), "app"),
      destDir: path.join(process.cwd(), "public", "raw-mdx"),
    })
  }
}

void main()
