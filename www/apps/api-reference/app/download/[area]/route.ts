import path from "path"
import {
  throwErrorResponse,
  withRouteErrorHandling,
  workerCompatibleFetch,
} from "docs-utils"
import { getPathForEnv } from "../../../utils/get-path-for-env"
import { readSpecFromBinding } from "../../../utils/read-spec-from-binding"

type DownloadParams = {
  params: Promise<{
    area: string
  }>
}

export const GET = withRouteErrorHandling(
  async (request: Request, props: DownloadParams) => {
    const params = await props.params
    const { area } = params
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")

    const r2Base = process.env.SPECS_R2_BASE_URL
    const basePath = r2Base
      ? `${r2Base}/specs`
      : path.join(process.cwd(), "specs")

    // A requested version resolves to its own spec only — falling back to the
    // default spec would return the wrong document for an unknown version.
    const specUrl = version
      ? getPathForEnv(basePath, "versions", version, area, "openapi.full.yaml")
      : getPathForEnv(basePath, area, "openapi.full.yaml")

    let fileContent: string | null = await readSpecFromBinding(specUrl)

    fileContent ??= await workerCompatibleFetch<string | null>({
      url: specUrl,
      responseTransformer: async (res) => {
        if (res.status === 404) {
          return null
        }
        if (!res.ok) {
          throw new Error(`Failed to fetch spec: ${res.status}`)
        }
        return await res.text()
      },
      fallbackAction: async () => {
        // In local development, we can read the spec directly from the filesystem
        const { readFileSync, existsSync } = await import("fs")

        if (!existsSync(specUrl)) {
          return null
        }
        return readFileSync(specUrl, "utf-8")
      },
    })

    if (!fileContent) {
      throwErrorResponse(
        404,
        version
          ? `No OpenAPI spec found for area "${area}" and version "${version}"`
          : `No OpenAPI spec found for area "${area}"`
      )
    }

    return new Response(fileContent, {
      headers: {
        "Content-Type": "application/x-yaml",
        "Content-Disposition": `attachment; filename="openapi.yaml"`,
      },
    })
  }
)
