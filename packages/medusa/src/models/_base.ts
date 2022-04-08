import { BeforeInsert, CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

/**
 * Base abstract entity for all entities
 */
export abstract class BaseEntity {
  abstract prefixId: string;

  @PrimaryColumn()
  id: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  protected beforeInsert() {
    if (this.id) return
    const id = ulid()
    if (!this.prefixId) {
      throw new Error(`Missing property prefixId from the model ${this.constructor.name}`)
    }
    this.id = `${this.prefixId}_${id}`
  }
}