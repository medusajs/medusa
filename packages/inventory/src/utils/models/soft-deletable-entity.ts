import { DeleteDateColumn } from "typeorm"
import { BaseEntity } from "./base-entity"
import { resolveDbType } from "../db-aware-column"

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null
}
