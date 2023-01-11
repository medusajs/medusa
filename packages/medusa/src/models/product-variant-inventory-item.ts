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
 * properties:
 *   id:
 *     type: string
 *     description: The product variant inventory item's ID
 *     example: pvitem_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   inventory_item_id:
 *     description: "The id of the inventory item"
 *     type: string
 *   variant_id:
 *     description: "The id of the variant."
 *     type: string
 *   required_quantity:
 *     description: "The quantity of an inventory item required for one quantity of the variant."
 *     type: integer
 *     default: 1
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
