import { IsBoolean } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { AnalyticsConfigService } from "../../../../services"
import { CreateAnalyticsConfig } from "../../../../types/analytics-config"

// No OAS for this route, for internal use only.
export default async (req: Request, res: Response) => {
  const userId = (req.user?.userId ?? req.user?.id)!
  const validatedBody = req.validatedBody as CreateAnalyticsConfig
  const analyticsConfigService: AnalyticsConfigService = req.scope.resolve(
    "analyticsConfigService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const analyticsConfig = await manager.transaction(
    async (transactionManager) => {
      return await analyticsConfigService
        .withTransaction(transactionManager)
        .create(userId, validatedBody)
    }
  )

  res.status(200).json({ analytics_config: analyticsConfig })
}

export class AdminPostAnalyticsConfigReq {
  @IsBoolean()
  opt_out: boolean

  @IsBoolean()
  anonymize?: boolean = false
}
