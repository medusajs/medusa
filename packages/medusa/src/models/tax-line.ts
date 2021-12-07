import {
  Entity,
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

import { LineItem } from "./line-item"

@Entity()
export class TaxLine {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.tax_lines)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column({ nullable: true })
  rate: number

  @Column()
  name: string

  @Column()
  code: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `tl_${id}`
  }
}

/**
 * @schema tax_line
 * title: "Tax Line"
 * description: "Line item that specifies an amount of tax to add to a line item."
 * x-resourceId: tax_line
 * properties:
 *   id:
 *     description: "The id of the Tax Line. This value will be prefixed by `tl_`."
 *     type: string
 *   code:
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
