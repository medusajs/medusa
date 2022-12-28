import { BeforeInsert, Entity, Index, JoinColumn, ManyToOne } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

import { StockLocationAddress } from "."

@Entity()
export class StockLocation extends SoftDeletableEntity {
  @DbAwareColumn({ type: "text" })
  name: string

  @Index()
  @DbAwareColumn({ type: "text", nullable: true })
  address_id: string | null

  @ManyToOne(() => StockLocationAddress)
  @JoinColumn({ name: "address_id" })
  address: StockLocationAddress | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sloc")
  }
}
