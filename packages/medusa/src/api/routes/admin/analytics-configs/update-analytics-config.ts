import { IsBoolean, IsOptional } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { AnalyticsConfigService } from "../../../../services"
import { UpdateAnalyticsConfig } from "../../../../types/analytics-config"

// No OAS for this route, for internal use only.
export default async (req: Request, res: Response) => {
  const userId = (req.user?.userId ?? req.user?.id)!
  const validatedBody = req.validatedBody as UpdateAnalyticsConfig
  const analyticsConfigService: AnalyticsConfigService = req.scope.resolve(
    "analyticsConfigService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const analyticsConfig = await manager.transaction(
    async (transactionManager) => {
      return await analyticsConfigService
        .withTransaction(transactionManager)
        .update(userId, validatedBody)
    }
  )

  res.status(200).json({ analytics_config: analyticsConfig })
}

export class AdminPostAnalyticsConfigAnalyticsConfigReq {
  @IsOptional()
  @IsBoolean()
  opt_out?: boolean

  @IsOptional()
  @IsBoolean()
  anonymize?: boolean
}
