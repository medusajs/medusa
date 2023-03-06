import { generateEntityId, SoftDeletableEntity } from "medusa-core-utils"
import { BeforeInsert, Column, Index } from "typeorm"
import AnalyticsFeatureFlag from "../loaders/feature-flags/analytics"
import { FeatureFlagEntity } from "../utils"

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
