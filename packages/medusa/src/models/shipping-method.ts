import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from "typeorm"

import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils/generate-entity-id"
import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { Order } from "./order"
import { Return } from "./return"
import { ShippingMethodTaxLine } from "./shipping-method-tax-line"
import { ShippingOption } from "./shipping-option"
import { Swap } from "./swap"

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
  order: Relation<Order>

  @Index()
  @Column({ nullable: true })
  claim_order_id: string | null

  @ManyToOne(() => ClaimOrder)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: Relation<ClaimOrder>

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart, (cart) => cart.shipping_methods)
  @JoinColumn({ name: "cart_id" })
  cart: Relation<Cart>

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Relation<Swap>

  @Index()
  @Column({ nullable: true })
  return_id: string

  @OneToOne(() => Return, (ret) => ret.shipping_method)
  @JoinColumn({ name: "return_id" })
  return_order: Relation<Return>

  @ManyToOne(() => ShippingOption)
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: Relation<ShippingOption>

  @OneToMany(() => ShippingMethodTaxLine, (tl) => tl.shipping_method, {
    cascade: ["insert"],
  })
  tax_lines: Relation<ShippingMethodTaxLine>[]

  @Column({ type: "int" })
  price: number

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax: boolean

  subtotal?: number
  total?: number
  tax_total?: number

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sm")
  }
}

/**
 * @schema ShippingMethod
 * title: "Shipping Method"
 * description: "A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of."
 * type: object
 * required:
 *   - cart_id
 *   - claim_order_id
 *   - data
 *   - id
 *   - order_id
 *   - price
 *   - return_id
 *   - shipping_option_id
 *   - swap_id
 * properties:
 *   id:
 *     description: The shipping method's ID
 *     type: string
 *     example: sm_01F0YET7DR2E7CYVSDHM593QG2
 *   shipping_option_id:
 *     description: The ID of the Shipping Option that the Shipping Method is built from.
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   order_id:
 *     description: The ID of the order that the shipping method is used in.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that the shipping method is used in.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   claim_order_id:
 *     description: The ID of the claim that the shipping method is used in.
 *     nullable: true
 *     type: string
 *     example: null
 *   claim_order:
 *     description: The details of the claim that the shipping method is used in.
 *     x-expandable: "claim_order"
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   cart_id:
 *     description: The ID of the cart that the shipping method is used in.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: The details of the cart that the shipping method is used in.
 *     x-expandable: "cart"
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   swap_id:
 *     description: The ID of the swap that the shipping method is used in.
 *     nullable: true
 *     type: string
 *     example: null
 *   swap:
 *     description: The details of the swap that the shipping method is used in.
 *     x-expandable: "swap"
 *     nullable: true
 *     $ref: "#/components/schemas/Swap"
 *   return_id:
 *     description: The ID of the return that the shipping method is used in.
 *     nullable: true
 *     type: string
 *     example: null
 *   return_order:
 *     description: The details of the return that the shipping method is used in.
 *     x-expandable: "return_order"
 *     nullable: true
 *     $ref: "#/components/schemas/Return"
 *   shipping_option:
 *     description: The details of the shipping option the method was created from.
 *     x-expandable: "shipping_option"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingOption"
 *   tax_lines:
 *     description: The details of the tax lines applied on the shipping method.
 *     type: array
 *     x-expandable: "tax_lines"
 *     items:
 *       $ref: "#/components/schemas/ShippingMethodTaxLine"
 *   price:
 *     description: The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of.
 *     type: integer
 *     example: 200
 *   data:
 *     description: Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id.
 *     type: object
 *     example: {}
 *   includes_tax:
 *     description: "Whether the shipping method price include tax"
 *     type: boolean
 *     x-featureFlag: "tax_inclusive_pricing"
 *     default: false
 *   subtotal:
 *     description: The subtotal of the shipping
 *     type: integer
 *     example: 8000
 *   total:
 *     description: The total amount of the shipping
 *     type: integer
 *     example: 8200
 *   tax_total:
 *     description: The total of tax
 *     type: integer
 *     example: 0
 */
