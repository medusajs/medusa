import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { DiscountCondition } from "./discount-condition"
import { ProductTag } from "./product-tag"

@Entity()
export class DiscountConditionProductTag {
  @PrimaryColumn()
  product_tag_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => ProductTag, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_tag_id" })
  product_tag?: ProductTag

  @ManyToOne(() => DiscountCondition, { onDelete: "CASCADE" })
  @JoinColumn({ name: "condition_id" })
  discount_condition?: DiscountCondition

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
}

/**
 * @schema discount_condition_product_tag
 * title: "Product Tag Discount Condition"
 * description: "Associates a discount condition with a product tag"
 * x-resourceId: discount_condition_product_tag
 * type: object
 * required:
 *   - product_tag_id
 *   - condition_id
 * properties:
 *   product_tag_id:
 *     description: "The ID of the Product Tag"
 *     type: string
 *     example: ptag_01F0YESHPZYY3H4SJ3A5918SBN
 *   condition_id:
 *     description: "The ID of the Discount Condition"
 *     type: string
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   product_tag:
 *     description: Available if the relation `product_tag` is expanded.
 *     $ref: "#/components/schemas/product_tag"
 *   discount_condition:
 *     description: Available if the relation `discount_condition` is expanded.
 *     $ref: "#/components/schemas/discount_condition"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
