import { Index, BeforeInsert, Column, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class ProductVariantInventoryItem extends SoftDeletableEntity {
  @Index({ unique: true })
  @DbAwareColumn({ type: "text" })
  inventory_item_id: string

  @DbAwareColumn({ type: "text" })
  variant_id: string

  @Column({ type: "int" })
  quantity: number

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvitem")
  }
}
