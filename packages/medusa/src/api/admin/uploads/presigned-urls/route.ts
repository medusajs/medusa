import { ulid } from "ulid"
import { MIMEType } from "util"
import type {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@zjedene-medusa/framework/http"
import {
  Modules,
  MedusaError,
  MedusaErrorTypes,
} from "@zjedene-medusa/framework/utils"
import type { HttpTypes } from "@zjedene-medusa/framework/types"
import type { AdminUploadPreSignedUrlType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUploadPreSignedUrlType>,
  res: MedusaResponse<HttpTypes.AdminUploadPreSignedUrlResponse>
) => {
  const fileProvider = req.scope.resolve(Modules.FILE)
  let type: MIMEType

  try {
    type = new MIMEType(req.validatedBody.mime_type)
  } catch {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      `Invalid file type "${req.validatedBody.mime_type}"`,
      MedusaErrorTypes.INVALID_DATA
    )
  }

  const extension = type.subtype
  const uniqueFilename = `${ulid()}.${extension}`

  const response = await fileProvider.getUploadFileUrls({
    filename: uniqueFilename,
    mimeType: req.validatedBody.mime_type,
    access: req.validatedBody.access ?? "private",
  })

  res.json({
    url: response.url,
    filename: response.key,
    mime_type: type.toString(),
    size: req.validatedBody.size,
    extension,
    originalname: req.validatedBody.originalname,
  })
}
