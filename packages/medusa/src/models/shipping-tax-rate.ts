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

import { ShippingOption } from "./shipping-option"
import { TaxRate } from "./tax-rate"

@Entity()
export class ShippingTaxRate {
  @PrimaryColumn()
  shipping_option_id: string

  @PrimaryColumn()
  rate_id: string

  @ManyToOne(() => ShippingOption, { onDelete: "CASCADE" })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option?: ShippingOption

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
 * @schema shipping_tax_rate
 * title: "Shipping Tax Rate"
 * description: "Associates a tax rate with a shipping option to indicate that the shipping option is taxed in a certain way"
 * x-resourceId: shipping_tax_rate
 * properties:
 *   shipping_option_id:
 *     description: "The id of the Shipping Option"
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
