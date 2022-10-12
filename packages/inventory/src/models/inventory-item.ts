import { Index, BeforeInsert, Column, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class InventoryItem extends SoftDeletableEntity {
  @Index({ unique: true })
  @DbAwareColumn({ type: "text" })
  sku: string

  @DbAwareColumn({ type: "text" })
  origin_country: string

  @Column()
  hs_code: number

  @Column()
  requires_shipping: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
