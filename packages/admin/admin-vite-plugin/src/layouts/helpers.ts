import { crawl } from "../utils"

export async function getLayoutFilesFromSources(
  sources: Set<string>
): Promise<string[]> {
  return (
    await Promise.all(
      Array.from(sources).map(async (source) => crawl(`${source}/layouts`))
    )
  ).flat()
}
