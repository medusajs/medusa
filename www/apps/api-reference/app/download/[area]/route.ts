import path from "path"
import { workerCompatibleFetch } from "docs-utils"
import { getPathForEnv } from "../../../utils/get-path-for-env"

type DownloadParams = {
  params: Promise<{
    area: string
  }>
}

export async function GET(request: Request, props: DownloadParams) {
  const params = await props.params
  const { area } = params
  const { searchParams } = new URL(request.url)
  const version = searchParams.get("version")

  const r2Base = process.env.SPECS_R2_BASE_URL
  const basePath = r2Base
    ? `${r2Base}/specs`
    : path.join(process.cwd(), "specs")

  // Try versioned path first, fall back to default
  const defaultUrl = getPathForEnv(basePath, area, "openapi.full.yaml")
  const versionedUrl = version
    ? getPathForEnv(basePath, "versions", version, area, "openapi.full.yaml")
    : null

  const fileContent: string = await workerCompatibleFetch<string>({
    url: versionedUrl || defaultUrl,
    responseTransformer: async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch spec: ${res.status}`)
      }
      return await res.text()
    },
    fallbackAction: async () => {
      // In local development, we can read the spec directly from the filesystem
      const { readFileSync, existsSync } = await import("fs")

      const filePath =
        versionedUrl && existsSync(versionedUrl) ? versionedUrl : defaultUrl
      if (!existsSync(filePath)) {
        throw new Error(`Spec file not found: ${filePath}`)
      }
      return readFileSync(filePath, "utf-8")
    },
  })

  return new Response(fileContent, {
    headers: {
      "Content-Type": "application/x-yaml",
      "Content-Disposition": `attachment; filename="openapi.yaml"`,
    },
  })
}
