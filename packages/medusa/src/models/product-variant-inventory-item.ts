import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from "typeorm"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"
import { ProductVariant } from "./product-variant"

@Entity()
export class ProductVariantInventoryItem extends SoftDeletableEntity {
  @Index()
  @Column({ type: "text" })
  inventory_item_id: string

  @Index()
  @Column({ type: "text" })
  variant_id: string

  @ManyToOne(() => ProductVariant, (variant) => variant.inventory_items)
  @JoinColumn({ name: "variant_id" })
  variant: Relation<ProductVariant>

  @Column({ type: "int", default: 1 })
  required_quantity: number

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pvitem")
  }
}

/**
 * @schema ProductVariantInventoryItem
 * title: "Product Variant Inventory Item"
 * description: "A Product Variant Inventory Item links variants with inventory items and denotes the required quantity of the variant."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
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
 *   variant:
 *     description: The details of the product variant.
 *     x-expandable: "variant"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductVariant"
 *   required_quantity:
 *     description: The quantity of an inventory item required for the variant.
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
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
