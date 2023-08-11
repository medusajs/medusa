import { AnalyticsConfig } from "../models/analytics-config"
import { dataSource } from "../loaders/database"

export const AnalyticsConfigRepository = dataSource.getRepository(AnalyticsConfig)
export default AnalyticsConfigRepository
