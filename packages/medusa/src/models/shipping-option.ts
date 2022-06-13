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

import { ShippingProfile } from "./shipping-profile"
import { Region } from "./region"
import { FulfillmentProvider } from "./fulfillment-provider"
import { ShippingOptionRequirement } from "./shipping-option-requirement"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

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

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "so")
  }
}

/**
 * @schema shipping_option
 * title: "Shipping Option"
 * description: "Shipping Options represent a way in which an Order or Return can be shipped. Shipping Options have an associated Fulfillment Provider that will be used when the fulfillment of an Order is initiated. Shipping Options themselves cannot be added to Carts, but serve as a template for Shipping Methods. This distinction makes it possible to customize individual Shipping Methods with additional information."
 * x-resourceId: shipping_option
 * properties:
 *   id:
 *     description: "The id of the Shipping Option. This value will be prefixed with `so_`."
 *     type: string
 *   name:
 *     description: "The name given to the Shipping Option - this may be displayed to the Customer."
 *     type: string
 *   region_id:
 *     description: "The id of the Region that the Shipping Option belongs to."
 *     type: string
 *   region:
 *     description: "The id of the Region that the Shipping Option belongs to."
 *     anyOf:
 *       - $ref: "#/components/schemas/region"
 *   profile_id:
 *     description: "The id of the Shipping Profile that the Shipping Option belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products."
 *     type: string
 *   provider_id:
 *     description: "The id of the Fulfillment Provider, that will be used to process Fulfillments from the Shipping Option."
 *     type: string
 *   price_type:
 *     description: "The type of pricing calculation that is used when creatin Shipping Methods from the Shipping Option. Can be `flat_rate` for fixed prices or `calculated` if the Fulfillment Provider can provide price calulations."
 *     type: string
 *     enum:
 *       - flat_rate
 *       - calculated
 *   amount:
 *     description: "The amount to charge for shipping when the Shipping Option price type is `flat_rate`."
 *     type: integer
 *   is_return:
 *     description: "Flag to indicate if the Shipping Option can be used for Return shipments."
 *     type: boolean
 *   requirements:
 *     description: "The requirements that must be satisfied for the Shipping Option to be available for a Cart."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/shipping_option_requirement"
 *   data:
 *     description: "The data needed for the Fulfillment Provider to identify the Shipping Option."
 *     type: object
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
