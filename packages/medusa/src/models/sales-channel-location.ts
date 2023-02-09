import { BeforeInsert, Column, Index, JoinColumn, ManyToOne } from "typeorm"

import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { SalesChannel } from "./sales-channel"

@FeatureFlagEntity("sales_channels")
export class SalesChannelLocation extends SoftDeletableEntity {
  @Index()
  @Column({ type: "text" })
  sales_channel_id: string

  @Index()
  @Column({ type: "text" })
  location_id: string

  @ManyToOne(() => SalesChannel, (sc) => sc.locations)
  @JoinColumn({ name: "sales_channel_id" })
  sales_channel?: SalesChannel | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "scloc")
  }
}
