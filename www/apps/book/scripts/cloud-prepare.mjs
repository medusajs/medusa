import "dotenv/config"
import path from "path"
import { copyMdxToPublic } from "build-scripts"

async function main() {
  if (!process.env.MC_ENV) {
    return
  }

  // eslint-disable-next-line no-console
  console.log("Copying MDX files to public/raw-mdx...")
  await copyMdxToPublic({
    srcDir: path.join(process.cwd(), "app"),
    destDir: path.join(process.cwd(), "public", "raw-mdx"),
  })
  // eslint-disable-next-line no-console
  console.log("Done copying MDX files")
}

void main()
