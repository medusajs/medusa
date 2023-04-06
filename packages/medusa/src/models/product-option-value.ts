import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductOptionValue extends SoftDeletableEntity {
  @Column()
  value: string

  @Index()
  @Column()
  option_id: string

  @ManyToOne(() => ProductOption, (option) => option.values)
  @JoinColumn({ name: "option_id" })
  option: ProductOption

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(() => ProductVariant, (variant) => variant.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "optval")
  }
}

/**
 * @schema ProductOptionValue
 * title: "Product Option Value"
 * description: "A value given to a Product Variant's option set. Product Variant have a Product Option Value for each of the Product Options defined on the Product."
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
 *     description: The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is \"Size\" this value could be `Small`, `Medium` or `Large`).
 *     type: string
 *     example: large
 *   option_id:
 *     description: The ID of the Product Option that the Product Option Value is defined for.
 *     type: string
 *     example: opt_01F0YESHQBZVKCEXJ24BS6PCX3
 *   option:
 *     description: Available if the relation `option` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ProductOption"
 *   variant_id:
 *     description: The ID of the Product Variant that the Product Option Value is defined for.
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: Available if the relation `variant` is expanded.
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
 */
