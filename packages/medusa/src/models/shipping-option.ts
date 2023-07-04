import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { FulfillmentProvider } from "./fulfillment-provider"
import { Region } from "./region"
import { ShippingOptionRequirement } from "./shipping-option-requirement"
import { ShippingProfile } from "./shipping-profile"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"

export enum ShippingOptionPriceType {
  FLAT_RATE = "flat_rate",
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
  region: Region

  @Index()
  @Column()
  profile_id: string

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: ShippingProfile

  @Index()
  @Column()
  provider_id: string

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: FulfillmentProvider

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
  requirements: ShippingOptionRequirement[]

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax: boolean

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "so")
  }
}

/**
 * @schema ShippingOption
 * title: "Shipping Option"
 * description: "Shipping Options represent a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information."
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
 *     description: The region's ID
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   profile_id:
 *     description: The ID of the Shipping Profile that the shipping option belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products.
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   profile:
 *     description: Available if the relation `profile` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingProfile"
 *   provider_id:
 *     description: The id of the Fulfillment Provider, that will be used to process Fulfillments from the Shipping Option.
 *     type: string
 *     example: manual
 *   provider:
 *     description: Available if the relation `provider` is expanded.
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
 *     description: The requirements that must be satisfied for the Shipping Option to be available for a Cart. Available if the relation `requirements` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ShippingOptionRequirement"
 *   data:
 *     description: The data needed for the Fulfillment Provider to identify the Shipping Option.
 *     type: object
 *     example: {}
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Does the shipping option price include tax"
 *     type: boolean
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
 */
