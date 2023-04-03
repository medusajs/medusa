import { DeleteDateColumn } from "typeorm"
import { resolveDbType } from "../db-aware-column"
import { BaseEntity } from "./base-entity"

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null
}
