import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

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
  product?: Product | null

  // Note the onDelete config here
  @ManyToOne(() => TaxRate, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rate_id" })
  tax_rate?: TaxRate | null

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null
}

/**
 * @schema ProductTaxRate
 * title: "Product Tax Rate"
 * description: "Associates a tax rate with a product to indicate that the product is taxed in a certain way"
 * type: object
 * required:
 *   - product_id
 *   - rate_id
 * properties:
 *   product_id:
 *     description: "The ID of the Product"
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: Available if the relation `product` is expanded.
 *     $ref: "#/components/schemas/Product"
 *   rate_id:
 *     description: "The ID of the Tax Rate"
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   tax_rate:
 *     description: Available if the relation `tax_rate` is expanded.
 *     $ref: "#/components/schemas/TaxRate"
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
