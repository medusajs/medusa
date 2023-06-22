import { mkdir, readFile, readdir, writeFile } from "fs/promises"
import * as path from "path"

function replaceContent(
  content: string,
  variables: Record<string, string>
): string {
  return content.replace(/\{\{\s?(.*?)\s?\}\}/g, (match, key) => {
    return variables[key] ?? ""
  })
}

export async function cloneTemplateDirectory(
  inputDir: string,
  outputDir: string,
  variables: Record<string, string>
): Promise<void> {
  const entries = await readdir(inputDir, { withFileTypes: true })

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name)
    let outputPath = path.join(outputDir, entry.name)

    if (entry.isDirectory()) {
      try {
        await mkdir(outputPath)
      } catch {}

      await cloneTemplateDirectory(inputPath, outputPath, variables)
    } else if (entry.isFile()) {
      const content = await readFile(inputPath, "utf8")
      const processed = replaceContent(content, variables)

      let fileName = entry.name.replace(/\.txt$/gi, "")

      fileName = fileName.replace(/\[(.*?)]/g, (match, key) => {
        return variables[key] ?? ""
      })

      outputPath = path.join(outputDir, fileName)
      await writeFile(outputPath, processed, "utf8")
    }
  }
}
