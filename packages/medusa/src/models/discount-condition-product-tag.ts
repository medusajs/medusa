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
 * @schema DiscountConditionProductTag
 * title: "Product Tag Discount Condition"
 * description: "Associates a discount condition with a product tag"
 * type: object
 * required:
 *   - condition_id
 *   - created_at
 *   - metadata
 *   - product_tag_id
 *   - updated_at
 * properties:
 *   product_tag_id:
 *     description: The ID of the Product Tag
 *     type: string
 *     example: ptag_01F0YESHPZYY3H4SJ3A5918SBN
 *   condition_id:
 *     description: The ID of the Discount Condition
 *     type: string
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   product_tag:
 *     description: Available if the relation `product_tag` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ProductTag"
 *   discount_condition:
 *     description: Available if the relation `discount_condition` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/DiscountCondition"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
