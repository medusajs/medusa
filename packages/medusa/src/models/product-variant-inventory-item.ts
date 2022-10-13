import { Index, Unique, BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn, generateEntityId } from "../utils"

@Entity()
@Unique(["variant_id", "inventory_item_id"])
export class ProductVariantInventoryItem extends BaseEntity {
  @Index()
  @DbAwareColumn({ type: "text" })
  inventory_item_id: string

  @Index()
  @DbAwareColumn({ type: "text" })
  variant_id: string

  @Column({ type: "int", default: 1 })
  quantity: number

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvitem")
  }
}
