import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateOrganizationType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const organizationModule = req.scope.resolve(Modules.ORGANIZATION)
  const [organizations, count] = await organizationModule.listAndCountOrganizations(
    req.filterableFields,
    req.queryConfig
  )

  res.json({
    organizations,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateOrganizationType>,
  res: MedusaResponse
) => {
  const organizationModule = req.scope.resolve(Modules.ORGANIZATION)
  const organization = await organizationModule.createOrganizations(req.validatedBody)

  res.status(200).json({ organization })
}
