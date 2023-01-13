import { AnalyticsConfig } from "@medusajs/medusa"
import { Connection } from "typeorm"

export type AnalyticsConfigData = {
  id?: string
  user_id?: string
  opt_out?: boolean
  anonymize?: boolean
}

export const simpleAnalyticsConfigFactory = async (
  connection: Connection,
  data: AnalyticsConfigData = {}
): Promise<AnalyticsConfig> => {
  const manager = connection.manager

  const job = manager.create<AnalyticsConfig>(AnalyticsConfig, {
    id: data.id ?? "test-analytics-config",
    user_id: data.user_id ?? "admin_user",
    opt_out: data.opt_out ?? false,
    anonymize: data.anonymize ?? false,
  })

  return await manager.save<AnalyticsConfig>(job)
}
