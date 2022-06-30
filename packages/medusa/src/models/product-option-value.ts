import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
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
 * @schema product_option_value
 * title: "Product Option Value"
 * description: "A value given to a Product Variant's option set. Product Variant have a Product Option Value for each of the Product Options defined on the Product."
 * x-resourceId: product_option_value
 * properties:
 *   id:
 *     description: "The id of the Product Option Value. This value will be prefixed with `optval_`."
 *     type: string
 *   value:
 *     description: "The value that the Product Variant has defined for the specific Product Option (e.g. if the Product Option is \"Size\" this value could be \"Small\", \"Medium\" or \"Large\")."
 *     type: string
 *   option_id:
 *     description: "The id of the Product Option that the Product Option Value is defined for."
 *     type: string
 *   variant_id:
 *     description: "The id of the Product Variant that the Product Option Value is defined for."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
