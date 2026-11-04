import { promises as fs } from "fs"
import path from "path"
import { inlineMdxImports } from "docs-utils"

type Options = {
  srcDir: string
  destDir: string
}

async function copyDir(src: string, dest: string): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true })

  await fs.mkdir(dest, { recursive: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else if (
      entry.isFile() &&
      (entry.name === "page.mdx" || entry.name === "_md-content.mdx")
    ) {
      // partials aren't copied, so inline them into the page's content
      const content = await fs.readFile(srcPath, "utf-8")
      await fs.writeFile(destPath, await inlineMdxImports(content, srcPath))
    }
  }
}

export async function copyMdxToPublic({
  srcDir,
  destDir,
}: Options): Promise<void> {
  await copyDir(srcDir, destDir)
}
