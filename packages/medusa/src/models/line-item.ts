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
import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { DbAwareColumn } from "../utils/db-aware-column"
import { LineItemAdjustment } from "./line-item-adjustment"
import { LineItemTaxLine } from "./line-item-tax-line"
import { Order } from "./order"
import { ProductVariant } from "./product-variant"
import { Swap } from "./swap"
import { generateEntityId } from "../utils"
import {
  FeatureFlagClassDecorators,
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"
import { OrderEdit } from "./order-edit"

@Check(`"fulfilled_quantity" <= "quantity"`)
@Check(`"shipped_quantity" <= "fulfilled_quantity"`)
@Check(`"returned_quantity" <= "quantity"`)
@Check(`"quantity" > 0`)
@FeatureFlagClassDecorators(OrderEditingFeatureFlag.key, [
  Index(
    "unique_li_original_item_id_order_edit_id",
    ["order_edit_id", "original_item_id"],
    {
      unique: true,
      where: "WHERE original_item_id IS NOT NULL AND order_edit_id IS NOT NULL",
    }
  ),
])
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

  @FeatureFlagColumn(OrderEditingFeatureFlag.key, {
    nullable: true,
    type: "varchar",
  })
  original_item_id?: string | null

  @FeatureFlagColumn(OrderEditingFeatureFlag.key, {
    nullable: true,
    type: "varchar",
  })
  order_edit_id?: string | null

  @FeatureFlagDecorators(OrderEditingFeatureFlag.key, [
    ManyToOne(
      () => OrderEdit,
      (orderEdit) => orderEdit.items
    ),
    JoinColumn({ name: "order_edit_id" }),
  ])
  order_edit?: OrderEdit | null

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

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
 * @schema line_item
 * title: "Line Item"
 * description: "Line Items represent purchasable units that can be added to a Cart for checkout. When Line Items are purchased they will get copied to the resulting order and can eventually be referenced in Fulfillments and Returns. Line Items may also be created when processing Swaps and Claims."
 * x-resourceId: line_item
 * type: object
 * required:
 *   - title
 *   - unit_price
 *   - quantity
 * properties:
 *   id:
 *     type: string
 *     description: The cart's ID
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   cart_id:
 *     description: "The ID of the Cart that the Line Item belongs to."
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   order_id:
 *     description: "The ID of the Order that the Line Item belongs to."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   swap_id:
 *     description: "The id of the Swap that the Line Item belongs to."
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     type: object
 *   claim_order_id:
 *     description: "The id of the Claim that the Line Item belongs to."
 *     type: string
 *     example: null
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     type: object
 *   tax_lines:
 *     description: Available if the relation `tax_lines` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item_tax_line"
 *   adjustments:
 *     description: Available if the relation `adjustments` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/line_item_adjustment"
 *   title:
 *     description: "The title of the Line Item, this should be easily identifiable by the Customer."
 *     type: string
 *     example: Medusa Coffee Mug
 *   description:
 *     description: "A more detailed description of the contents of the Line Item."
 *     type: string
 *     example: One Size
 *   thumbnail:
 *     description: "A URL string to a small image of the contents of the Line Item."
 *     type: string
 *     format: uri
 *     example: https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png
 *   is_return:
 *     description: "Is the item being returned"
 *     type: boolean
 *     example: false
 *   is_giftcard:
 *     description: "Flag to indicate if the Line Item is a Gift Card."
 *     type: boolean
 *     example: false
 *   should_merge:
 *     description: "Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item."
 *     type: boolean
 *     example: false
 *   allow_discounts:
 *     description: "Flag to indicate if the Line Item should be included when doing discount calculations."
 *     type: boolean
 *     example: false
 *   has_shipping:
 *     description: "Flag to indicate if the Line Item has fulfillment associated with it."
 *     type: boolean
 *     example: false
 *   unit_price:
 *     description: "The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to."
 *     type: boolean
 *     example: 8000
 *   variant_id:
 *     description: "The id of the Product Variant contained in the Line Item."
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: A product variant object. The Product Variant contained in the Line Item. Available if the relation `variant` is expanded.
 *     type: object
 *   quantity:
 *     description: "The quantity of the content in the Line Item."
 *     type: integer
 *     example: 1
 *   fulfilled_quantity:
 *     description: "The quantity of the Line Item that has been fulfilled."
 *     type: integer
 *     example: 0
 *   returned_quantity:
 *     description: "The quantity of the Line Item that has been returned."
 *     type: integer
 *     example: 0
 *   shipped_quantity:
 *     description: "The quantity of the Line Item that has been shipped."
 *     type: integer
 *     example: 0
 *   refundable:
 *     description: "The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration."
 *     type: integer
 *     example: 0
 *   subtotal:
 *     type: integer
 *     description: The subtotal of the line item
 *     example: 8000
 *   tax_total:
 *     type: integer
 *     description: The total of tax of the line item
 *     example: 0
 *   total:
 *     type: integer
 *     description: The total amount of the line item
 *     example: 8000
 *   original_total:
 *     type: integer
 *     description: The original total amount of the line item
 *     example: 8000
 *   original_tax_total:
 *     type: integer
 *     description: The original tax total amount of the line item
 *     example: 0
 *   discount_total:
 *     type: integer
 *     description: The total of discount of the line item
 *     example: 0
 *   gift_card_total:
 *     type: integer
 *     description: The total of the gift card of the line item
 *     example: 0
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Indicates if the line item unit_price include tax"
 *     type: boolean
 *   original_item_id:
 *     description: "[EXPERIMENTAL] The id of the original line item"
 *     type: string
 *   order_edit_id:
 *     description: "[EXPERIMENTAL] The ID of the order edit to which a cloned item belongs"
 *     type: string
 *   order_edit:
 *     description: "[EXPERIMENTAL] The order edit joined"
 *     type: object
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
