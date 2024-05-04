import { Index, Column, Entity } from "typeorm"
import { BaseEntity, resolveDbType } from "@medusajs/medusa"

@Entity()
export class DistributedLocking extends BaseEntity {
  @Index()
  @Column({ type: "text" })
  id: string

  @Column({ type: "text", nullable: true })
  owner_id: string | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  expiration: Date | null
}
