import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils/generate-entity-id"
import { FulfillmentProvider } from "./fulfillment-provider"
import { Region } from "./region"
import { ShippingOptionRequirement } from "./shipping-option-requirement"
import { ShippingProfile } from "./shipping-profile"

/**
 * @enum
 *
 * The type of the shipping option price.
 */
export enum ShippingOptionPriceType {
  /**
   * The shipping option's price is a flat rate.
   */
  FLAT_RATE = "flat_rate",
  /**
   * The shipping option's price is calculated. In this case, the `amount` field is typically `null`.
   */
  CALCULATED = "calculated",
}

@Check(`"amount" >= 0`)
@Entity()
export class ShippingOption extends SoftDeletableEntity {
  @Column()
  name: string

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Relation<Region>

  @Index()
  @Column()
  profile_id: string

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: Relation<ShippingProfile>

  @Index()
  @Column()
  provider_id: string

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: Relation<FulfillmentProvider>

  @DbAwareColumn({ type: "enum", enum: ShippingOptionPriceType })
  price_type: ShippingOptionPriceType

  @Column({ type: "int", nullable: true })
  amount: number | null

  @Column({ default: false })
  is_return: boolean

  @Column({ default: false })
  admin_only: boolean

  @OneToMany(() => ShippingOptionRequirement, (req) => req.shipping_option, {
    cascade: ["insert"],
  })
  requirements: Relation<ShippingOptionRequirement>[]

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax: boolean

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "so")
  }
}

/**
 * @schema ShippingOption
 * title: "Shipping Option"
 * description: "A Shipping Option represents a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information."
 * type: object
 * required:
 *   - admin_only
 *   - amount
 *   - created_at
 *   - data
 *   - deleted_at
 *   - id
 *   - is_return
 *   - metadata
 *   - name
 *   - price_type
 *   - profile_id
 *   - provider_id
 *   - region_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The shipping option's ID
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   name:
 *     description: The name given to the Shipping Option - this may be displayed to the Customer.
 *     type: string
 *     example: PostFake Standard
 *   region_id:
 *     description: The ID of the region this shipping option can be used in.
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: The details of the region this shipping option can be used in.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   profile_id:
 *     description: The ID of the Shipping Profile that the shipping option belongs to.
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   profile:
 *     description: The details of the shipping profile that the shipping option belongs to.
 *     x-expandable: "profile"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingProfile"
 *   provider_id:
 *     description: The ID of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
 *     type: string
 *     example: manual
 *   provider:
 *     description: The details of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
 *     x-expandable: "provider"
 *     nullable: true
 *     $ref: "#/components/schemas/FulfillmentProvider"
 *   price_type:
 *     description: The type of pricing calculation that is used when creatin Shipping Methods from the Shipping Option. Can be `flat_rate` for fixed prices or `calculated` if the Fulfillment Provider can provide price calulations.
 *     type: string
 *     enum:
 *       - flat_rate
 *       - calculated
 *     example: flat_rate
 *   amount:
 *     description: The amount to charge for shipping when the Shipping Option price type is `flat_rate`.
 *     nullable: true
 *     type: integer
 *     example: 200
 *   is_return:
 *     description: Flag to indicate if the Shipping Option can be used for Return shipments.
 *     type: boolean
 *     default: false
 *   admin_only:
 *     description: Flag to indicate if the Shipping Option usage is restricted to admin users.
 *     type: boolean
 *     default: false
 *   requirements:
 *     description: The details of the requirements that must be satisfied for the Shipping Option to be available for usage in a Cart.
 *     type: array
 *     x-expandable: "requirements"
 *     items:
 *       $ref: "#/components/schemas/ShippingOptionRequirement"
 *   data:
 *     description: The data needed for the Fulfillment Provider to identify the Shipping Option.
 *     type: object
 *     example: {}
 *   includes_tax:
 *     description: "Whether the shipping option price include tax"
 *     type: boolean
 *     x-featureFlag: "tax_inclusive_pricing"
 *     default: false
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
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
