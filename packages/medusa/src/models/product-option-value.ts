import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"

@Entity()
export class ProductOptionValue extends SoftDeletableEntity {
  @Column()
  value: string

  @Index("idx_product_option_value_option_id")
  @Column()
  option_id: string

  @ManyToOne(() => ProductOption, (option) => option.values)
  @JoinColumn({ name: "option_id" })
  option: Relation<ProductOption>

  @Index("idx_product_option_value_variant_id")
  @Column()
  variant_id: string

  @ManyToOne(() => ProductVariant, (variant) => variant.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variant_id" })
  variant: Relation<ProductVariant>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "optval")
  }
}

/**
 * @schema ProductOptionValue
 * title: "Product Option Value"
 * description: "An option value is one of the possible values of a Product Option. Product Variants specify a unique combination of product option values."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - option_id
 *   - updated_at
 *   - value
 *   - variant_id
 * properties:
 *   id:
 *     description: The product option value's ID
 *     type: string
 *     example: optval_01F0YESHR7S6ECD03RF6W12DSJ
 *   value:
 *     description: The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is "Size" this value could be `Small`, `Medium` or `Large`).
 *     type: string
 *     example: large
 *   option_id:
 *     description: The ID of the Product Option that the Product Option Value belongs to.
 *     type: string
 *     example: opt_01F0YESHQBZVKCEXJ24BS6PCX3
 *   option:
 *     description: The details of the product option that the Product Option Value belongs to.
 *     x-expandable: "option"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductOption"
 *   variant_id:
 *     description: The ID of the product variant that uses this product option value.
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: The details of the product variant that uses this product option value.
 *     x-expandable: "variant"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductVariant"
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
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
