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
import { Product } from "./product"

@Entity()
export class DiscountConditionProduct {
  @PrimaryColumn()
  product_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product?: Product

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
 * @schema DiscountConditionProduct
 * title: "Product Discount Condition"
 * description: "Associates a discount condition with a product"
 * type: object
 * required:
 *   - condition_id
 *   - created_at
 *   - metadata
 *   - product_id
 *   - updated_at
 * properties:
 *   product_id:
 *     description: The ID of the Product Tag
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   condition_id:
 *     description: The ID of the Discount Condition
 *     type: string
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   product:
 *     description: Available if the relation `product` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Product"
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
