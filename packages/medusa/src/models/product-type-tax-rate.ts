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

import { ProductType } from "./product-type"
import { TaxRate } from "./tax-rate"

@Entity()
export class ProductTypeTaxRate {
  @PrimaryColumn()
  product_type_id: string

  @PrimaryColumn()
  rate_id: string

  @ManyToOne(() => ProductType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_type_id" })
  product_type?: ProductType

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
 * @schema product_type_tax_rate
 * title: "Product Type Tax Rate"
 * description: "Associates a tax rate with a product type to indicate that the product type is taxed in a certain way"
 * x-resourceId: product_type_tax_rate
 * properties:
 *   product_type_id:
 *     description: "The id of the Product type"
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
