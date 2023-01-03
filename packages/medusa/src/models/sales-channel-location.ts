import { BeforeInsert, Index, Column } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { BaseEntity } from "../interfaces"
import { generateEntityId } from "../utils"

export class SalesChannelLocation extends BaseEntity {
  @Index()
  @Column({ type: "text" })
  sales_channel_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "scloc")
  }
}
