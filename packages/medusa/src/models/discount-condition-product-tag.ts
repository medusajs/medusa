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
  metadata: any
}

/**
 * @schema discount_condition_product_tag
 * title: "Product Tag Discount Condition"
 * description: "Associates a discount condition with a product tag"
 * x-resourceId: discount_condition_product_tag
 * properties:
 *   product_tag_id:
 *     description: "The id of the Product Tag"
 *     type: string
 *   condition_id:
 *     description: "The id of the Discount Condition"
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
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
