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
import { ProductType } from "./product-type"

@Entity()
export class DiscountConditionProductType {
  @PrimaryColumn()
  product_type_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => ProductType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_type_id" })
  product_type?: ProductType

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
 * @schema discount_condition_product_type
 * title: "Product Type Discount Condition"
 * description: "Associates a discount condition with a product type"
 * x-resourceId: discount_condition_product
 * properties:
 *   product_type_id:
 *     description: "The id of the Product Type"
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
