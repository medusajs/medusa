import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { ResetPasswordRequestType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<ResetPasswordRequestType>,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params
  const { identifier } = req.validatedBody

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: {
      entityId: identifier,
      provider: auth_provider,
      secret: http.jwtSecret as string,
    },
    throwOnError: false, // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false
