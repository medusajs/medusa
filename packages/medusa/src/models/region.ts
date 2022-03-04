import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Currency } from "./currency"
import { TaxRate } from "./tax-rate"
import { Country } from "./country"
import { PaymentProvider } from "./payment-provider"
import { FulfillmentProvider } from "./fulfillment-provider"
import { TaxProvider } from "./tax-provider"

@Entity()
export class Region {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "real" })
  tax_rate: number

  @OneToMany(() => TaxRate, (tr) => tr.region)
  tax_rates: TaxRate[] | null

  @Column({ nullable: true })
  tax_code: string

  @Column({ default: true })
  gift_cards_taxable: boolean

  @Column({ default: true })
  automatic_taxes: boolean

  @OneToMany(() => Country, (c) => c.region)
  countries: Country[]

  @Column({ type: "text", nullable: true })
  tax_provider_id: string | null

  @ManyToOne(() => TaxProvider)
  @JoinColumn({ name: "tax_provider_id" })
  tax_provider: TaxProvider

  @ManyToMany(() => PaymentProvider, {
    eager: true,
    cascade: ["insert", "update"],
  })
  @JoinTable({
    name: "region_payment_providers",
    joinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "provider_id",
      referencedColumnName: "id",
    },
  })
  payment_providers: PaymentProvider[]

  @ManyToMany(() => FulfillmentProvider, {
    eager: true,
    cascade: ["insert", "update"],
  })
  @JoinTable({
    name: "region_fulfillment_providers",
    joinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "provider_id",
      referencedColumnName: "id",
    },
  })
  fulfillment_providers: FulfillmentProvider[]

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `reg_${id}`
  }
}

/**
 * @schema region
 * title: "Region"
 * description: "Regions hold settings for how Customers in a given geographical location shop. The is, for example, where currencies and tax rates are defined. A Region can consist of multiple countries to accomodate common shopping settings across countries."
 * x-resourceId: region
 * properties:
 *   id:
 *     description: "The id of the Region. This value will be prefixed with `reg_`."
 *     type: string
 *   name:
 *     description: "The name of the region as displayed to the customer. If the Region only has one country it is recommended to write the country name."
 *     type: string
 *   currency_code:
 *     description: "The 3 character ISO currency code that Customers will shop in in the Region."
 *     type: string
 *   tax_rate:
 *     description: "The tax rate that should be charged on purchases in the Region."
 *     type: number
 *   tax_code:
 *     description: "The tax code used on purchases in the Region. This may be used by other systems for accounting purposes."
 *     type: string
 *   countries:
 *     description: "The countries that are included in the Region."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/country"
 *   payment_providers:
 *     description: "The Payment Providers that can be used to process Payments in the Region."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/payment_provider"
 *   fulfillment_providers:
 *     description: "The Fulfillment Providers that can be used to fulfill orders in the Region."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/fulfillment_provider"
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
