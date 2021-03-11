import {
  Entity,
  Index,
  JoinColumn,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"

import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"

@Entity()
export class ProductOptionValue {
  @PrimaryColumn()
  id: string

  @Column()
  value: string

  @Index()
  @Column()
  option_id: string

  @ManyToOne(
    () => ProductOption,
    option => option.values
  )
  @JoinColumn({ name: "option_id" })
  option: ProductOption

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(
    () => ProductVariant,
    variant => variant.options
  )
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `optval_${id}`
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
