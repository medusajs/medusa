import { BeforeInsert, Column, Entity } from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"

// @Entity()
@FeatureFlagEntity("sales-channels")
export class SalesChannel extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ default: true })
  is_disabled: boolean

  // @Column({ type: resolveDbType("timestamptz"), nullable: true })
  // disabled_at: Date | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc")
  }
}
