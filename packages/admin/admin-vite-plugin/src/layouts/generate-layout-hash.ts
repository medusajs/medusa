import fs from "fs/promises"
import { generateHash } from "../utils"
import { getLayoutFilesFromSources } from "./helpers"

export async function generateLayoutHash(
  sources: Set<string>
): Promise<string> {
  const files = await getLayoutFilesFromSources(sources)
  const contents = await Promise.all(
    files.map((file) => fs.readFile(file, "utf-8"))
  )
  return generateHash(contents.join(""))
}
