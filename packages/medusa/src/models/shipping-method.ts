import {
  Entity,
  Check,
  BeforeInsert,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn } from "../utils/db-aware-column"

import { ClaimOrder } from "./claim-order"
import { Order } from "./order"
import { Cart } from "./cart"
import { Swap } from "./swap"
import { Return } from "./return"
import { ShippingOption } from "./shipping-option"
import { ShippingMethodTaxLine } from "./shipping-method-tax-line"

@Check(
  `"claim_order_id" IS NOT NULL OR "order_id" IS NOT NULL OR "cart_id" IS NOT NULL OR "swap_id" IS NOT NULL OR "return_id" IS NOT NULL`
)
@Check(`"price" >= 0`)
@Entity()
export class ShippingMethod {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  shipping_option_id: string

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  return_id: string

  @OneToOne(() => Return, (ret) => ret.shipping_method)
  @JoinColumn({ name: "return_id" })
  return_order: Return

  @ManyToOne(() => ShippingOption, { eager: true })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @OneToMany(() => ShippingMethodTaxLine, (tl) => tl.shipping_method, {
    cascade: ["insert"],
  })
  tax_lines: ShippingMethodTaxLine[]

  @Column({ type: "int" })
  price: number

  @DbAwareColumn({ type: "jsonb" })
  data: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `sm_${id}`
  }
}

/**
 * @schema shipping_method
 * title: "Shipping Method"
 * description: "Shipping Methods represent a way in which an Order or Return can be shipped. Shipping Methods are built from a Shipping Option, but may contain additional details, that can be necessary for the Fulfillment Provider to handle the shipment."
 * x-resourceId: shipping_method
 * properties:
 *   id:
 *     description: "The id of the Shipping Method. This value will be prefixed with `sm_`."
 *     type: string
 *   shipping_option_id:
 *     description: "The id of the Shipping Option that the Shipping Method is built from."
 *     type: string
 *   shipping_option:
 *     description: "The Shipping Option that the Shipping Method is built from."
 *     anyOf:
 *       - $ref: "#/components/schemas/shipping_option"
 *   order_id:
 *     description: "The id of the Order that the Shipping Method is used on."
 *     type: string
 *   return_id:
 *     description: "The id of the Return that the Shipping Method is used on."
 *     type: string
 *   swap_id:
 *     description: "The id of the Swap that the Shipping Method is used on."
 *     type: string
 *   cart_id:
 *     description: "The id of the Cart that the Shipping Method is used on."
 *     type: string
 *   claim_order_id:
 *     description: "The id of the Claim that the Shipping Method is used on."
 *     type: string
 *   price:
 *     description: "The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of."
 *     type: integer
 *   data:
 *     description: "Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id."
 *     type: object
 */
