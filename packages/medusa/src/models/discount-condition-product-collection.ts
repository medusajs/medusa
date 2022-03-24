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
import { ProductCollection } from "./product-collection"

@Entity()
export class DiscountConditionProductCollection {
  @PrimaryColumn()
  product_collection_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => ProductCollection, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_collection_id" })
  product_collection?: ProductCollection

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
 * @schema discount_condition_product_collection
 * title: "Product Collection Discount Condition"
 * description: "Associates a discount condition with a product collection"
 * x-resourceId: discount_condition_product_collection
 * properties:
 *   product_collection_id:
 *     description: "The id of the Product Collection"
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
