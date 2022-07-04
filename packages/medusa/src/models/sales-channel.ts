import { BeforeInsert, Column, Entity } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"

// @FeatureFlagEntity("sales-channels")
@Entity()
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ nullable: true })
  description: string | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  disabled_at: Date | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}
