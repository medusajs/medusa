import { uploadFilesWorkflow } from "@medusajs/core-flows"
import { CreateProductDTO } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductDTO>,
  res: MedusaResponse
) => {
  const input = req.files as any[]
  const { result, errors } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: input?.map((f) => ({
        filename: "test",
        mimeType: "image/jpeg",
        content: f.buffer,
      })),
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }
  res.status(200).json({ files: result })
}
