import { BeforeInsert, Column, Entity, Index, Unique } from "typeorm"
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
  required_quantity: number

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvitem")
  }
}

/**
 * @schema ProductVariantInventoryItem
 * title: "Product Variant Inventory Item"
 * description: "Product Variant Inventory Items link variants with inventory items and denote the number of inventory items constituting a variant."
 * type: object
 * required:
 *   - created_at
 *   - id
 *   - inventory_item_id
 *   - required_quantity
 *   - updated_at
 *   - variant_id
 * properties:
 *   id:
 *     description: The product variant inventory item's ID
 *     type: string
 *     example: pvitem_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   inventory_item_id:
 *     description: The id of the inventory item
 *     type: string
 *   variant_id:
 *     description: The id of the variant.
 *     type: string
 *   required_quantity:
 *     description: The quantity of an inventory item required for one quantity of the variant.
 *     type: integer
 *     default: 1
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 */
