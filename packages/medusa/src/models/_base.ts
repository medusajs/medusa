import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

/**
 * Base abstract entity for all entities
 */
export abstract class BaseEntity {
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

  protected generateId(prefix: string): void | false {
    if (this.id) {
      return false
    }
    const id = ulid()
    if (!prefix) {
      throw new Error(
        `Missing static property prefixId from the model ${this.constructor.name}`
      )
    }
    this.id = `${prefix}_${id}`
  }
}
