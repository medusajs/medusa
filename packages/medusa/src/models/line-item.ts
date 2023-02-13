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

import { BaseEntity } from "../interfaces"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { LineItemAdjustment } from "./line-item-adjustment"
import { LineItemTaxLine } from "./line-item-tax-line"
import { Order } from "./order"
import { OrderEdit } from "./order-edit"
import { ProductVariant } from "./product-variant"
import { Swap } from "./swap"

@Check(`"fulfilled_quantity" <= "quantity"`)
@Check(`"shipped_quantity" <= "fulfilled_quantity"`)
@Check(`"returned_quantity" <= "quantity"`)
@Check(`"quantity" > 0`)
@Index(
  "unique_li_original_item_id_order_edit_id",
  ["order_edit_id", "original_item_id"],
  {
    unique: true,
    where: "original_item_id IS NOT NULL AND order_edit_id IS NOT NULL",
  }
)
@Entity()
export class LineItem extends BaseEntity {
  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string | null

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

  @OneToMany(() => LineItemAdjustment, (lia) => lia.item, {
    cascade: ["insert"],
  })
  adjustments: LineItemAdjustment[]

  @Column({ nullable: true, type: "varchar" })
  original_item_id?: string | null

  @Column({ nullable: true, type: "varchar" })
  order_edit_id?: string | null

  @ManyToOne(() => OrderEdit, (orderEdit) => orderEdit.items)
  @JoinColumn({ name: "order_edit_id" })
  order_edit?: OrderEdit | null

  @Column()
  title: string

  @Column({ nullable: true, type: "text" })
  description: string | null

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @Column({ default: false })
  is_return: boolean

  @Column({ default: false })
  is_giftcard: boolean

  @Column({ default: true })
  should_merge: boolean

  @Column({ default: true })
  allow_discounts: boolean

  @Column({ nullable: true, type: "boolean" })
  has_shipping: boolean | null

  @Column({ type: "int" })
  unit_price: number

  @Index()
  @Column({ nullable: true, type: "text" })
  variant_id: string | null

  @ManyToOne(() => ProductVariant, { eager: true })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "int" })
  quantity: number

  @Column({ nullable: true, type: "int" })
  fulfilled_quantity: number | null

  @Column({ nullable: true, type: "int" })
  returned_quantity: number | null

  @Column({ nullable: true, type: "int" })
  shipped_quantity: number | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax: boolean

  refundable?: number | null
  subtotal?: number | null
  tax_total?: number | null
  total?: number | null
  original_total?: number | null
  original_tax_total?: number | null
  discount_total?: number | null
  gift_card_total?: number | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "item")
  }
}

/**
 * @schema LineItem
 * title: "Line Item"
 * description: "Line Items represent purchasable units that can be added to a Cart for checkout. When Line Items are purchased they will get copied to the resulting order and can eventually be referenced in Fulfillments and Returns. Line Items may also be created when processing Swaps and Claims."
 * type: object
 * required:
 *   - allow_discounts
 *   - cart_id
 *   - claim_order_id
 *   - created_at
 *   - description
 *   - fulfilled_quantity
 *   - has_shipping
 *   - id
 *   - is_giftcard
 *   - is_return
 *   - metadata
 *   - order_edit_id
 *   - order_id
 *   - original_item_id
 *   - quantity
 *   - returned_quantity
 *   - shipped_quantity
 *   - should_merge
 *   - swap_id
 *   - thumbnail
 *   - title
 *   - unit_price
 *   - updated_at
 *   - variant_id
 * properties:
 *   id:
 *     description: The line item's ID
 *     type: string
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   cart_id:
 *     description: The ID of the Cart that the Line Item belongs to.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   order_id:
 *     description: The ID of the Order that the Line Item belongs to.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   swap_id:
 *     description: The id of the Swap that the Line Item belongs to.
 *     nullable: true
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Swap"
 *   claim_order_id:
 *     description: The id of the Claim that the Line Item belongs to.
 *     nullable: true
 *     type: string
 *     example: null
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   tax_lines:
 *     description: Available if the relation `tax_lines` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItemTaxLine"
 *   adjustments:
 *     description: Available if the relation `adjustments` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItemAdjustment"
 *   original_item_id:
 *     description: The id of the original line item
 *     nullable: true
 *     type: string
 *   order_edit_id:
 *     description: The ID of the order edit to which a cloned item belongs
 *     nullable: true
 *     type: string
 *   order_edit:
 *     description: The order edit joined. Available if the relation `order_edit` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/OrderEdit"
 *   title:
 *     description: The title of the Line Item, this should be easily identifiable by the Customer.
 *     type: string
 *     example: Medusa Coffee Mug
 *   description:
 *     description: A more detailed description of the contents of the Line Item.
 *     nullable: true
 *     type: string
 *     example: One Size
 *   thumbnail:
 *     description: A URL string to a small image of the contents of the Line Item.
 *     nullable: true
 *     type: string
 *     format: uri
 *     example: https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png
 *   is_return:
 *     description: Is the item being returned
 *     type: boolean
 *     default: false
 *   is_giftcard:
 *     description: Flag to indicate if the Line Item is a Gift Card.
 *     type: boolean
 *     default: false
 *   should_merge:
 *     description: Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item.
 *     type: boolean
 *     default: true
 *   allow_discounts:
 *     description: Flag to indicate if the Line Item should be included when doing discount calculations.
 *     type: boolean
 *     default: true
 *   has_shipping:
 *     description: Flag to indicate if the Line Item has fulfillment associated with it.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   unit_price:
 *     description: The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to.
 *     type: integer
 *     example: 8000
 *   variant_id:
 *     description: The id of the Product Variant contained in the Line Item.
 *     nullable: true
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: A product variant object. The Product Variant contained in the Line Item. Available if the relation `variant` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ProductVariant"
 *   quantity:
 *     description: The quantity of the content in the Line Item.
 *     type: integer
 *     example: 1
 *   fulfilled_quantity:
 *     description: The quantity of the Line Item that has been fulfilled.
 *     nullable: true
 *     type: integer
 *     example: 0
 *   returned_quantity:
 *     description: The quantity of the Line Item that has been returned.
 *     nullable: true
 *     type: integer
 *     example: 0
 *   shipped_quantity:
 *     description: The quantity of the Line Item that has been shipped.
 *     nullable: true
 *     type: integer
 *     example: 0
 *   refundable:
 *     description: The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration.
 *     type: integer
 *     example: 0
 *   subtotal:
 *     description: The subtotal of the line item
 *     type: integer
 *     example: 8000
 *   tax_total:
 *     description: The total of tax of the line item
 *     type: integer
 *     example: 0
 *   total:
 *     description: The total amount of the line item
 *     type: integer
 *     example: 8000
 *   original_total:
 *     description: The original total amount of the line item
 *     type: integer
 *     example: 8000
 *   original_tax_total:
 *     description: The original tax total amount of the line item
 *     type: integer
 *     example: 0
 *   discount_total:
 *     description: The total of discount of the line item
 *     type: integer
 *     example: 0
 *   gift_card_total:
 *     description: The total of the gift card of the line item
 *     type: integer
 *     example: 0
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Indicates if the line item unit_price include tax"
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
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
