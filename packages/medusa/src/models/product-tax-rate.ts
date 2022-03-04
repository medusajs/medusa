import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Product } from "./product"
import { TaxRate } from "./tax-rate"

@Entity()
export class ProductTaxRate {
  @PrimaryColumn()
  product_id: string

  @PrimaryColumn()
  rate_id: string

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product?: Product

  // Note the onDelete config here
  @ManyToOne(() => TaxRate, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rate_id" })
  tax_rate?: TaxRate

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any
}

/**
 * @schema product_tax_rate
 * title: "Product Tax Rate"
 * description: "Associates a tax rate with a product to indicate that the product is taxed in a certain way"
 * x-resourceId: product_tax_rate
 * properties:
 *   product_id:
 *     description: "The id of the Product"
 *     type: string
 *   rate_id:
 *     description: "The id of the Tax Rate"
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
