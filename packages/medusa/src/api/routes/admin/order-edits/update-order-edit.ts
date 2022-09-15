import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { OrderEditService } from "../../../../services"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostOrderEditsOrderEditReq
  }

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")
  const manager: EntityManager = req.scope.resolve("manager")
  const order_edit = await manager.transaction(async (transactionManager) => {
    return await orderEditService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  res.status(200).json({ order_edit })
}

export class AdminPostOrderEditsOrderEditReq {
  @IsOptional()
  @IsString()
  internal_note?: string
}
