import { BaseEntity } from "./base-entity"
import { DeleteDateColumn } from "typeorm"
import { resolveDbType } from "../../utils/db-aware-column"

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null
}
