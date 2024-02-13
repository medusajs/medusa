import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { deleteUsersWorkflow, updateUsersWorkflow } from "@medusajs/core-flows"
import { IUserModuleService, UpdateUserDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "../../../../../../modules-sdk/dist"
import { AdminUpdateUserRequest } from "../validators"

// Get user
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const moduleService: IUserModuleService = req.scope.resolve(
    ModuleRegistrationName.USER
  )
  const user = await moduleService.retrieve(id, req.retrieveConfig)

  res.status(200).json({ user })
}

// update user
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = updateUsersWorkflow(req.scope)

  const input = {
    updates: [
      {
        id: req.params.id,
        ...(req.validatedBody as AdminUpdateUserRequest),
      } as UpdateUserDTO,
    ],
  }

  const { result } = await workflow.run({ input })

  const [user] = result

  res.status(200).json({ user })
}

// delete user
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const workflow = deleteUsersWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "user",
    deleted: true,
  })
}
