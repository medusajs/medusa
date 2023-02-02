import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { Country } from "./country"
import { Currency } from "./currency"
import { DbAwareColumn } from "../utils/db-aware-column"
import { FulfillmentProvider } from "./fulfillment-provider"
import { PaymentProvider } from "./payment-provider"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { TaxProvider } from "./tax-provider"
import { TaxRate } from "./tax-rate"
import { generateEntityId } from "../utils/generate-entity-id"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

@Entity()
export class Region extends SoftDeletableEntity {
  @Column()
  name: string

  @Index()
  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency?: Currency | null

  @Column({ type: "real" })
  tax_rate: number

  @OneToMany(() => TaxRate, (tr) => tr.region)
  tax_rates?: TaxRate[]

  @Column({ nullable: true })
  tax_code: string | null

  @Column({ default: true })
  gift_cards_taxable: boolean

  @Column({ default: true })
  automatic_taxes: boolean

  @OneToMany(() => Country, (c) => c.region)
  countries?: Country[]

  @Column({ type: "text", nullable: true })
  tax_provider_id: string | null

  @ManyToOne(() => TaxProvider)
  @JoinColumn({ name: "tax_provider_id" })
  tax_provider?: TaxProvider | null

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
  payment_providers?: PaymentProvider[]

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
  fulfillment_providers?: FulfillmentProvider[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax?: boolean

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "reg")
  }
}

/**
 * @schema Region
 * title: "Region"
 * description: "Regions hold settings for how Customers in a given geographical location shop. The is, for example, where currencies and tax rates are defined. A Region can consist of multiple countries to accomodate common shopping settings across countries."
 * type: object
 * required:
 *   - name
 *   - currency_code
 *   - tax_rate
 * properties:
 *   id:
 *     type: string
 *     description: The region's ID
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   name:
 *     description: "The name of the region as displayed to the customer. If the Region only has one country it is recommended to write the country name."
 *     type: string
 *     example: EU
 *   currency_code:
 *     description: "The 3 character currency code that the Region uses."
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: Available if the relation `currency` is expanded.
 *     $ref: "#/components/schemas/Currency"
 *   tax_rate:
 *     description: "The tax rate that should be charged on purchases in the Region."
 *     type: number
 *     example: 0
 *   tax_rates:
 *     description: The tax rates that are included in the Region. Available if the relation `tax_rates` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/TaxRate"
 *   tax_code:
 *     description: "The tax code used on purchases in the Region. This may be used by other systems for accounting purposes."
 *     type: string
 *     example: null
 *   gift_cards_taxable:
 *     description: Whether the gift cards are taxable or not in this region.
 *     type: boolean
 *     default: true
 *   automatic_taxes:
 *     description: Whether taxes should be automated in this region.
 *     type: boolean
 *     default: true
 *   countries:
 *     description: The countries that are included in the Region. Available if the relation `countries` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Country"
 *   tax_provider_id:
 *     type: string
 *     description: The ID of the tax provider used in this region
 *     example: null
 *   tax_provider:
 *     description: Available if the relation `tax_provider` is expanded.
 *     $ref: "#/components/schemas/TaxProvider"
 *   payment_providers:
 *     description: The Payment Providers that can be used to process Payments in the Region. Available if the relation `payment_providers` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PaymentProvider"
 *   fulfillment_providers:
 *     description: The Fulfillment Providers that can be used to fulfill orders in the Region. Available if the relation `payment_providers` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/FulfillmentProvider"
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Does the prices for the region include tax"
 *     type: boolean
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
