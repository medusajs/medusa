import { resetPasswordWorkflow } from "@medusajs/core-flows"
import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

const AdminResetPasswordReq = z.object({
  token: z.string(),
  password: z.string(),
  entityId: z.string(),
})

type AdminResetPasswordReqType = z.infer<typeof AdminResetPasswordReq>

export const POST = async (
  req: MedusaRequest<AdminResetPasswordReqType>,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params

  await resetPasswordWorkflow(req.scope).run({
    input: {
      provider: auth_provider,
      token: req.validatedBody.token,
      password: req.validatedBody.password,
      entityId: req.validatedBody.entityId,
    },
  })

  res.status(200).json({ success: true })
}
