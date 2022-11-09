import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { AnalyticsConfigService } from "../../../../services"

// No OAS for this route, for internal use only.
export default async (req: Request, res: Response) => {
  const userId = (req.user?.userId ?? req.user?.id)!

  const analyticsConfigService: AnalyticsConfigService = req.scope.resolve(
    "analyticsConfigService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    return await analyticsConfigService
      .withTransaction(transactionManager)
      .delete(userId)
  })

  res
    .status(200)
    .json({ user_id: userId, object: "analytics_config", deleted: true })
}
