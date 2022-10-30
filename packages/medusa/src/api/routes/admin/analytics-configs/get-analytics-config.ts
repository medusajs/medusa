import { Request, Response } from "express"
import { AnalyticsConfigService } from "../../../../services"

// No OAS for this route, for internal use only.
export default async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user?.userId ?? req.user?.id)!

  const analyticsConfigService: AnalyticsConfigService = req.scope.resolve(
    "analyticsConfigService"
  )

  const analyticsConfig = await analyticsConfigService.retrieve(userId)
  res.status(200).json({ analytics_config: analyticsConfig })
}
