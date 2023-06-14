import { BeforeInsert, Column, Index } from "typeorm"
import { SoftDeletableEntity } from "../interfaces"
import AnalyticsFeatureFlag from "../loaders/feature-flags/analytics"
import { generateEntityId } from "../utils"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"

@FeatureFlagEntity(AnalyticsFeatureFlag.key)
export class AnalyticsConfig extends SoftDeletableEntity {
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  user_id: string

  @Column({ default: false })
  opt_out: boolean

  @Column({ default: false })
  anonymize: boolean

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "acfg")
  }
}
