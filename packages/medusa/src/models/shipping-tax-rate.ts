import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

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
  metadata: Record<string, unknown>
}

/**
 * @schema ShippingTaxRate
 * title: "Shipping Tax Rate"
 * description: "Associates a tax rate with a shipping option to indicate that the shipping option is taxed in a certain way"
 * type: object
 * required:
 *   - created_at
 *   - metadata
 *   - rate_id
 *   - shipping_option_id
 *   - updated_at
 * properties:
 *   shipping_option_id:
 *     description: The ID of the Shipping Option
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: Available if the relation `shipping_option` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingOption"
 *   rate_id:
 *     description: The ID of the Tax Rate
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   tax_rate:
 *     description: Available if the relation `tax_rate` is expanded.
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
 */
