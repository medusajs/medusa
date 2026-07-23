import { workerCompatibleFetch } from "docs-utils"
import path from "path"
import { loadReferenceFromBinding } from "./load-reference-from-binding"
import { fetchFromAssetsBinding } from "./fetch-from-assets-binding"

export async function fetchMdxContent(
  baseUrl: string,
  filePathFromMap: string
): Promise<string | null> {
  const isCloudflare = !!process.env.CLOUDFLARE_ENV
  // References files come from R2, so we need to fetch them directly from R2 instead of going through the app route
  if (filePathFromMap.includes("/references/")) {
    const r2Base = process.env.REFERENCES_R2_BASE_URL
    const relPath = filePathFromMap.replace(/^.*\/references\//, "")
    return (
      (await loadReferenceFromBinding(`resources/references/${relPath}`)) ??
      (await workerCompatibleFetch<string | null>({
        url: `${r2Base}/references/${relPath}`,
        responseTransformer: async (res) => {
          return res.ok ? res.text() : null
        },
        fallbackAction: async () => {
          try {
            const { promises: fs } = await import("fs")
            const relPath = filePathFromMap.replace(/^.*\/references\//, "")
            return await fs.readFile(
              path.join(process.cwd(), "references", relPath),
              "utf-8"
            )
          } catch {
            return null
          }
        },
        useRemote: isCloudflare,
      }))
    )
  }

  // app/ pages: derive app-relative path and use workerCompatibleFetch
  const relPath = filePathFromMap.replace(/^.*\/app\//, "")
  const rawMdxUrl = `${baseUrl}/raw-mdx/${relPath}`
  return (
    (await fetchFromAssetsBinding(rawMdxUrl)) ??
    (await workerCompatibleFetch<string | null>({
      url: rawMdxUrl,
      responseTransformer: async (res) => {
        return res.ok ? res.text() : null
      },
      fallbackAction: async () => {
        try {
          const { promises: fs } = await import("fs")
          return await fs.readFile(
            path.join(process.cwd(), "app", relPath),
            "utf-8"
          )
        } catch {
          return null
        }
      },
      useRemote: isCloudflare,
    }))
  )
}
