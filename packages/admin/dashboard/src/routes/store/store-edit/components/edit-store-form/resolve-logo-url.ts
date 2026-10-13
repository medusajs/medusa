import { sdk } from "../../../../../lib/client"
import { EditStoreSchemaType } from "./schema"

/**
 * Resolves the `logo_url` to save for the store: `null` when the logo was
 * removed, the uploaded file's URL when a new logo was picked, and the current
 * URL otherwise.
 */
export async function resolveLogoUrl(
  logo: EditStoreSchemaType["logo"]
): Promise<string | null> {
  if (!logo) {
    return null
  }

  if (!logo.file) {
    return logo.url
  }

  const { files } = await sdk.admin.upload.create({ files: [logo.file] })

  return files[0].url
}
