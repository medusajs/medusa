import { dataSource } from "../loaders/database"
import { AnalyticsConfig } from "../models/analytics-config"

export const AnalyticsConfigRepository = dataSource.getRepository(AnalyticsConfig)
export default AnalyticsConfigRepository
