import { createUserAccountWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateUserDTO,
  IAuthModuleService,
  IUserModuleService,
  UserDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import jwt from "jsonwebtoken"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "user",
    variables: {
      filters: req.filterableFields,
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: req.listConfig.select as string[],
  })

  const { rows: users, metadata } = await remoteQuery({
    ...query,
  })

  res.status(200).json({
    users,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateUserDTO>,
  res: MedusaResponse
) => {
  const userModuleService = req.scope.resolve<IUserModuleService>(
    ModuleRegistrationName.USER
  )
  const authModuleService = req.scope.resolve<IAuthModuleService>(
    ModuleRegistrationName.AUTH
  )

  const authUser = await authModuleService.retrieve(req.auth.auth_user_id)

  const { jwt_secret } = req.scope.resolve("configModule").projectConfig
  const token = jwt.sign(authUser, jwt_secret)

  let user: UserDTO | null = null

  if (req.auth.actor_id) {
    user = await userModuleService.retrieve(req.auth.actor_id)

    res.status(200).json({ user, token })

    return
  }

  const input = {
    input: {
      userData: req.validatedBody,
      authUserId: req.auth.auth_user_id,
    },
  }

  const { result } = await createUserAccountWorkflow(req.scope).run(input)

  user = result

  res.status(200).json({ user, token })
}
