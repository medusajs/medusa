import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateBasicMaterialType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const basic_material = await materialModule.retrieveBasicMaterial(
    req.params.id,
    req.queryConfig
  )

  if (!basic_material) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `BasicMaterial with id: ${req.params.id} was not found`
    )
  }

  res.json({ basic_material })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateBasicMaterialType>,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  const basic_material = await materialModule.updateBasicMaterials(
    req.params.id,
    req.validatedBody
  )

  res.json({ basic_material })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const materialModule = req.scope.resolve(Modules.MATERIAL)
  await materialModule.deleteBasicMaterials(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "basic_material",
    deleted: true,
  })
}
