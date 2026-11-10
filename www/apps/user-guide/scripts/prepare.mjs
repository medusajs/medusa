import {
  generateEditedDates,
  generateLlmsIndex,
  generateSidebar,
  generateSitemapUrls,
  getMdxPagesLlmsLinks,
  copyMdxToPublic,
} from "build-scripts"
import { sidebar } from "../sidebar.mjs"
import path from "path"

async function main() {
  await generateSidebar(sidebar)
  await generateEditedDates()
  await generateSitemapUrls()
  await generateLlmsIndex({
    title: "Medusa Admin User Guide",
    description:
      "Guides for merchants and store operators on using the Medusa Admin dashboard to manage products, orders, customers, and store settings.",
    sections: [
      {
        title: "Pages",
        links: getMdxPagesLlmsLinks({
          baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${process.env.NEXT_PUBLIC_BASE_PATH || "/user-guide"}`,
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
