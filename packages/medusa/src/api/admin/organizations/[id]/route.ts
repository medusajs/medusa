import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateOrganizationType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const organizationModule = req.scope.resolve(Modules.ORGANIZATION)
  const organization = await organizationModule.retrieveOrganization(
    req.params.id,
    req.queryConfig
  )

  if (!organization) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Organization with id: ${req.params.id} was not found`
    )
  }

  res.json({ organization })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateOrganizationType>,
  res: MedusaResponse
) => {
  const organizationModule = req.scope.resolve(Modules.ORGANIZATION)
  const organization = await organizationModule.updateOrganizations(
    req.params.id,
    req.validatedBody
  )

  res.json({ organization })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const organizationModule = req.scope.resolve(Modules.ORGANIZATION)
  await organizationModule.deleteOrganizations(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "organization",
    deleted: true,
  })
}
