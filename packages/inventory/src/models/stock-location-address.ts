import { BeforeInsert, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class StockLocationAddress extends SoftDeletableEntity {
  @DbAwareColumn({ type: "text" })
  address_1: string

  @DbAwareColumn({ type: "text", nullable: true })
  address_2: string

  @DbAwareColumn({ type: "text", nullable: true })
  city: string

  @DbAwareColumn({ type: "text", nullable: true })
  country_code: string

  @DbAwareColumn({ type: "text", nullable: true })
  phone: string

  @DbAwareColumn({ type: "text", nullable: true })
  province: string

  @DbAwareColumn({ type: "text", nullable: true })
  postal_code: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "laddr")
  }
}
