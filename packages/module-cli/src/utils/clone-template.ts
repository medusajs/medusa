import * as fs from "fs"
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
  const entries = await fs.promises.readdir(inputDir, { withFileTypes: true })

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name)
    let outputPath = path.join(outputDir, entry.name)

    if (entry.isDirectory()) {
      try {
        await fs.promises.mkdir(outputPath)
      } catch {}

      await cloneTemplateDirectory(inputPath, outputPath, variables)
    } else if (entry.isFile()) {
      const content = await fs.promises.readFile(inputPath, "utf8")
      const processed = replaceContent(content, variables)

      let fileName = entry.name.replace(/\.txt$/gi, "")

      fileName = fileName.replace(/\[(.*?)]/g, (match, key) => {
        return variables[key] ?? ""
      })

      outputPath = path.join(outputDir, fileName)
      await fs.promises.writeFile(outputPath, processed, "utf8")
    }
  }
}
