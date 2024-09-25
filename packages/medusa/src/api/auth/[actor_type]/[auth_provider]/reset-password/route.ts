import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider, actor_type } = req.params
  const { identifier } = req.body

  const { http } = req.scope.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  ).projectConfig

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: {
      entityId: identifier,
      actorType: actor_type,
      provider: auth_provider,
      secret: http.jwtSecret as string,
    },
    throwOnError: false, // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false
