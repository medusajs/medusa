import {
  Entity,
  OneToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { LineItemTaxLine } from "./line-item-tax-line"
import { Swap } from "./swap"
import { Cart } from "./cart"
import { Order } from "./order"
import { ClaimOrder } from "./claim-order"
import { ProductVariant } from "./product-variant"

@Check(`"fulfilled_quantity" <= "quantity"`)
@Check(`"shipped_quantity" <= "fulfilled_quantity"`)
@Check(`"returned_quantity" <= "quantity"`)
@Check(`"quantity" > 0`)
@Entity()
export class LineItem {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap, (swap) => swap.additional_items)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder, (co) => co.additional_items)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @OneToMany(() => LineItemTaxLine, (tl) => tl.item, { cascade: ["insert"] })
  tax_lines: LineItemTaxLine[]

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  thumbnail: string

  @Column({ default: false })
  is_return: boolean

  @Column({ default: false })
  is_giftcard: boolean

  @Column({ default: true })
  should_merge: boolean

  @Column({ default: true })
  allow_discounts: boolean

  @Column({ nullable: true })
  has_shipping: boolean

  @Column({ type: "int" })
  unit_price: number

  @Index()
  @Column({ nullable: true })
  variant_id: string

  @ManyToOne(() => ProductVariant, { eager: true })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "int" })
  quantity: number

  @Column({ nullable: true, type: "int" })
  fulfilled_quantity: number

  @Column({ nullable: true, type: "int" })
  returned_quantity: number

  @Column({ nullable: true, type: "int" })
  shipped_quantity: number

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  refundable: number | null

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `item_${id}`
  }
}

/**
 * @schema line_item
 * title: "Line Item"
 * description: "Line Items represent purchasable units that can be added to a Cart for checkout. When Line Items are purchased they will get copied to the resulting order and can eventually be referenced in Fulfillments and Returns. Line Items may also be created when processing Swaps and Claims."
 * x-resourceId: line_item
 * properties:
 *   id:
 *     description: "The id of the Line Item. This value will be prefixed by `item_`."
 *     type: string
 *   cart_id:
 *     description: "The id of the Cart that the Line Item belongs to."
 *     type: string
 *   order_id:
 *     description: "The id of the Order that the Line Item belongs to."
 *     type: string
 *   swap_id:
 *     description: "The id of the Swap that the Line Item belongs to."
 *     type: string
 *   claim_order_id:
 *     description: "The id of the Claim that the Line Item belongs to."
 *     type: string
 *   title:
 *     description: "The title of the Line Item, this should be easily identifiable by the Customer."
 *     type: string
 *   description:
 *     description: "A more detailed description of the contents of the Line Item."
 *     type: string
 *   thumbnail:
 *     description: "A URL string to a small image of the contents of the Line Item."
 *     type: string
 *   is_giftcard:
 *     description: "Flag to indicate if the Line Item is a Gift Card."
 *     type: boolean
 *   should_merge:
 *     description: "Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item."
 *     type: boolean
 *   allow_discounts:
 *     description: "Flag to indicate if the Line Item should be included when doing discount calculations."
 *     type: boolean
 *   unit_price:
 *     description: "The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to."
 *     type: boolean
 *   variant_id:
 *     description: "The id of the Product Variant contained in the Line Item."
 *     type: string
 *   variant:
 *     description: "The Product Variant contained in the Line Item."
 *     anyOf:
 *       - $ref: "#/components/schemas/product_variant"
 *   quantity:
 *     description: "The quantity of the content in the Line Item."
 *     type: integer
 *   fulfilled_quantity:
 *     description: "The quantity of the Line Item that has been fulfilled."
 *     type: integer
 *   returned_quantity:
 *     description: "The quantity of the Line Item that has been returned."
 *     type: integer
 *   shipped_quantity:
 *     description: "The quantity of the Line Item that has been shipped."
 *     type: integer
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 *   refundable:
 *     description: "The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration."
 *     type: integer
 */
