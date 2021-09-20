import {
  BeforeInsert,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { ulid } from "ulid";
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column";
import { ClaimOrder } from './claim-order';
import { ShippingOption } from "./shipping-option";
import { Swap } from './swap';


@Entity()
export class RMAShippingOption {
  @PrimaryColumn()
  id: string

  @Column({ type: "int" })
  price: number

  @Index()
  @Column()
  shipping_option_id: string;
  
  @ManyToOne(() => ShippingOption, { eager: true })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

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
    this.id = `rmaso_${id}`
  }
}

/**
 * @schema RMA shipping_option
 * title: "RMA Shipping Option"
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
