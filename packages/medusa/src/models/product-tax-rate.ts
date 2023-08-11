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
  metadata: Record<string, unknown>
}

/**
 * @schema ProductTaxRate
 * title: "Product Tax Rate"
 * description: "This represents the association between a tax rate and a product to indicate that the product is taxed in a way different than the default."
 * type: object
 * required:
 *   - created_at
 *   - metadata
 *   - product_id
 *   - rate_id
 *   - updated_at
 * properties:
 *   product_id:
 *     description: The ID of the Product
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: The details of the product.
 *     x-expandable: "product"
 *     nullable: true
 *     $ref: "#/components/schemas/Product"
 *   rate_id:
 *     description: The ID of the Tax Rate
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   tax_rate:
 *     description: The details of the tax rate.
 *     x-expandable: "tax_rate"
 *     nullable: true
 *     $ref: "#/components/schemas/TaxRate"
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
