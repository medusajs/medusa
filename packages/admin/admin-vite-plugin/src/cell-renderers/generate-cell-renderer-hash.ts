import fs from "fs/promises"
import path from "path"
import { generateHash } from "../utils"

export async function generateCellRendererHash(
  sources: Set<string>
): Promise<string> {
  const contents: string[] = []

  for (const source of sources) {
    const cellRenderersPath = path.join(source, "cell-renderers.tsx")
    try {
      const content = await fs.readFile(cellRenderersPath, "utf-8")
      contents.push(content)
    } catch {
      // File doesn't exist, skip
    }
  }

  const totalContent = contents.join("")
  return generateHash(totalContent)
}
