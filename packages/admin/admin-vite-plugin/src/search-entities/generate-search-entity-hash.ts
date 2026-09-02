import fs from "fs/promises"
import { generateHash } from "../utils"
import { findSearchEntityFile } from "./find-search-entity-file"

export async function generateSearchEntityHash(
  sources: Set<string>
): Promise<string> {
  const contents: string[] = []

  for (const source of sources) {
    const searchEntitiesPath = await findSearchEntityFile(source)

    if (!searchEntitiesPath) {
      continue
    }

    try {
      contents.push(await fs.readFile(searchEntitiesPath, "utf-8"))
    } catch {
      // File was removed between lookup and read.
    }
  }

  return generateHash(contents.join(""))
}
