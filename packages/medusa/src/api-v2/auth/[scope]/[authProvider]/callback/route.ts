import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { scope, authProvider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )
  res.status(200).json({})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({})
}
