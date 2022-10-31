import { EntityRepository, Repository } from "typeorm"
import { AnalyticsConfig } from "../models/analytics-config"

@EntityRepository(AnalyticsConfig)
export class AnalyticsConfigRepository extends Repository<AnalyticsConfig> {}
