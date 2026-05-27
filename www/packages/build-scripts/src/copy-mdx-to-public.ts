import { promises as fs } from "fs"
import path from "path"

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
      await fs.copyFile(srcPath, destPath)
    }
  }
}

export async function copyMdxToPublic({
  srcDir,
  destDir,
}: Options): Promise<void> {
  await copyDir(srcDir, destDir)
}
