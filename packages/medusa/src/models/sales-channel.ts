import { BeforeInsert, Column } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils"

@FeatureFlagEntity("sales_channels")
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string | null

  @Column({ default: false })
  is_disabled: boolean

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}
