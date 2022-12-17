import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"

import { Currency } from "./currency"
import { PriceList } from "./price-list"
import { ProductVariant } from "./product-variant"
import { Region } from "./region"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class MoneyAmount extends SoftDeletableEntity {
  @Index()
  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency?: Currency

  @Column({ type: "int" })
  amount: number

  @Column({ type: "int", nullable: true })
  min_quantity: number | null

  @Column({ type: "int", nullable: true })
  max_quantity: number | null

  @Column({ nullable: true })
  price_list_id: string | null

  @ManyToOne(() => PriceList, (priceList) => priceList.prices, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "price_list_id" })
  price_list: PriceList | null

  @Index()
  @Column({ nullable: true })
  variant_id: string

  @ManyToOne(() => ProductVariant, (variant) => variant.prices, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Index()
  @Column({ nullable: true })
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region?: Region

  @BeforeInsert()
  private beforeInsert(): undefined | void {
    this.id = generateEntityId(this.id, "ma")
  }
}

/**
 * @schema money_amount
 * title: "Money Amount"
 * description: "Money Amounts represents an amount that a given Product Variant can be purcased for. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used the amount will be in the currency defined for the Reigon."
 * x-resourceId: money_amount
 * type: object
 * required:
 *   - currency_code
 *   - amount
 * properties:
 *   id:
 *     type: string
 *     description: The money amount's ID
 *     example: ma_01F0YESHRFQNH5S8Q0PK84YYZN
 *   currency_code:
 *     description: "The 3 character currency code that the Money Amount is given in."
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: Available if the relation `currency` is expanded.
 *     $ref: "#/components/schemas/currency"
 *   amount:
 *     description: "The amount in the smallest currecny unit (e.g. cents 100 cents to charge $1) that the Product Variant will cost."
 *     type: integer
 *     example: 100
 *   min_quantity:
 *     description: "The minimum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities."
 *     type: integer
 *     example: 1
 *   max_quantity:
 *     description: "The maximum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities."
 *     type: integer
 *     example: 1
 *   price_list_id:
 *     type: string
 *     description: The ID of the price list associated with the money amount
 *     example: pl_01G8X3CKJXCG5VXVZ87H9KC09W
 *   price_list:
 *     description: Available if the relation `price_list` is expanded.
 *     $ref: "#/components/schemas/price_list"
 *   variant_id:
 *     description: "The id of the Product Variant contained in the Line Item."
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: The Product Variant contained in the Line Item. Available if the relation `variant` is expanded.
 *     type: object
 *   region_id:
 *     type: string
 *     description: The region's ID
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     type: object
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
