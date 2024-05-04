import {
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm"

import { MedusaV2Flag } from "@medusajs/utils"
import { BaseEntity } from "../interfaces"
import { featureFlagRouter } from "../loaders/feature-flags"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { DbAwareColumn, generateEntityId } from "../utils"
import {
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"
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
  cart: Relation<Cart>

  @Index()
  @Column({ nullable: true })
  order_id: string | null

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order: Relation<Order>

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap, (swap) => swap.additional_items)
  @JoinColumn({ name: "swap_id" })
  swap: Relation<Swap>

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder, (co) => co.additional_items)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: Relation<ClaimOrder>

  @OneToMany(() => LineItemTaxLine, (tl) => tl.item, {
    cascade: ["insert", "remove"],
  })
  tax_lines: Relation<LineItemTaxLine>[]

  @OneToMany(() => LineItemAdjustment, (lia) => lia.item, {
    cascade: ["insert", "remove"],
  })
  adjustments: Relation<LineItemAdjustment>[]

  @Column({ nullable: true, type: "varchar" })
  original_item_id?: string | null

  @Column({ nullable: true, type: "varchar" })
  order_edit_id?: string | null

  @ManyToOne(() => OrderEdit, (orderEdit) => orderEdit.items)
  @JoinColumn({ name: "order_edit_id" })
  order_edit?: Relation<OrderEdit> | null

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

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: Relation<ProductVariant>

  @FeatureFlagColumn(MedusaV2Flag.key, { nullable: true, type: "text" })
  product_id: string | null

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
  raw_discount_total?: number | null
  gift_card_total?: number | null

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "item")

    // This is to maintain compatibility while isolating the product domain
    if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
      if (
        this.variant &&
        Object.keys(this.variant).length === 1 &&
        this.variant.product_id
      ) {
        this.variant = undefined as any
      }
    }
  }

  /**
   * @apiIgnore
   */
  @FeatureFlagDecorators(MedusaV2Flag.key, [BeforeUpdate()])
  beforeUpdate(): void {
    if (
      this.variant &&
      Object.keys(this.variant).length === 1 &&
      this.variant.product_id
    ) {
      this.variant = undefined as any
    }
  }

  /**
   * @apiIgnore
   */
  @FeatureFlagDecorators(MedusaV2Flag.key, [AfterLoad(), AfterUpdate()])
  afterUpdateOrLoad(): void {
    if (this.variant) {
      return
    }

    if (this.product_id) {
      this.variant = { product_id: this.product_id } as any
    }
  }
}

/**
 * @schema LineItem
 * title: "Line Item"
 * description: "Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits."
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
 *     description: The ID of the cart that the line item may belongs to.
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: The details of the cart that the line item may belongs to.
 *     x-expandable: "cart"
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   order_id:
 *     description: The ID of the order that the line item may belongs to.
 *     nullable: true
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: The details of the order that the line item may belongs to.
 *     x-expandable: "order"
 *     nullable: true
 *     $ref: "#/components/schemas/Order"
 *   swap_id:
 *     description: The ID of the swap that the line item may belong to.
 *     nullable: true
 *     type: string
 *     example: null
 *   swap:
 *     description: The details of the swap that the line item may belong to.
 *     x-expandable: "swap"
 *     nullable: true
 *     $ref: "#/components/schemas/Swap"
 *   claim_order_id:
 *     description: The ID of the claim that the line item may belong to.
 *     nullable: true
 *     type: string
 *     example: null
 *   claim_order:
 *     description: The details of the claim that the line item may belong to.
 *     x-expandable: "claim_order"
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   tax_lines:
 *     description: The details of the item's tax lines.
 *     x-expandable: "tax_lines"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItemTaxLine"
 *   adjustments:
 *     description: The details of the item's adjustments, which are available when a discount is applied on the item.
 *     x-expandable: "adjustments"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItemAdjustment"
 *   original_item_id:
 *     description: The ID of the original line item. This is useful if the line item belongs to a resource that references an order, such as a return or an order edit.
 *     nullable: true
 *     type: string
 *   order_edit_id:
 *     description: The ID of the order edit that the item may belong to.
 *     nullable: true
 *     type: string
 *   order_edit:
 *     description: The details of the order edit.
 *     x-expandable: "order_edit"
 *     nullable: true
 *     $ref: "#/components/schemas/OrderEdit"
 *   title:
 *     description: The title of the Line Item.
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
 *     description: The details of the product variant that this item was created from.
 *     x-expandable: "variant"
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
 *     description: The total of discount of the line item rounded
 *     type: integer
 *     example: 0
 *   raw_discount_total:
 *     description: The total of discount of the line item
 *     type: integer
 *     example: 0
 *   gift_card_total:
 *     description: The total of the gift card of the line item
 *     type: integer
 *     example: 0
 *   includes_tax:
 *     description: "Indicates if the line item unit_price include tax"
 *     x-featureFlag: "tax_inclusive_pricing"
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
