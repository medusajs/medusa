import fs from "fs/promises"
import path from "path"
import { SEARCH_ENTITY_FILES } from "./constants"

/**
 * Returns the path of the source's search entity file, or `null` when the
 * source has none.
 */
export async function findSearchEntityFile(
  source: string
): Promise<string | null> {
  for (const fileName of SEARCH_ENTITY_FILES) {
    const filePath = path.join(source, fileName)

    try {
      await fs.access(filePath)
      return filePath
    } catch {
      // File doesn't exist, try next extension
    }
  }

  return null
}
