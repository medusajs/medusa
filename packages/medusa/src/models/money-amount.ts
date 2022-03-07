import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { ulid } from "ulid"
import { MoneyAmountType } from "../types/money-amount"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { Currency } from "./currency"
import { CustomerGroup } from "./customer-group"
import { ProductVariant } from "./product-variant"
import { Region } from "./region"

@Entity()
export class MoneyAmount {
  @PrimaryColumn()
  id: string

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int" })
  amount: number

  @DbAwareColumn({ type: "enum", enum: MoneyAmountType, default: "default" })
  type: MoneyAmountType

  @Column({
    type: resolveDbType("timestamptz"),
    nullable: true,
  })
  starts_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  ends_at: Date | null

  @Column({ type: "int", nullable: true })
  min_quantity: number | null

  @Column({ type: "int", nullable: true })
  max_quantity: number | null

  @ManyToMany(() => CustomerGroup, { cascade: true })
  @JoinTable({
    name: "money_amount_customer_groups",
    joinColumn: {
      name: "money_amount_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer_group_id",
      referencedColumnName: "id",
    },
  })
  customer_groups: CustomerGroup[]

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
  region: Region

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @BeforeInsert()
  private beforeInsert(): undefined | void {
    if (this.id) {
      return
    }
    const id = ulid()
    this.id = `ma_${id}`
  }
}

/**
 * @schema money_amount
 * title: "Money Amount"
 * description: "Money Amounts represents an amount that a given Product Variant can be purcased for. Each Money Amount either has a Currency or Region associated with it to indicate the pricing in a given Currency or, for fully region-based pricing, the given price in a specific Region. If region-based pricing is used the amount will be in the currency defined for the Reigon."
 * x-resourceId: money_amount
 * properties:
 *   id:
 *     description: "The id of the Money Amount. This value will be prefixed by `ma_`."
 *     type: string
 *   currency_code:
 *     description: "The 3 character currency code that the Money Amount is given in."
 *     type: string
 *   amount:
 *     description: "The amount in the smallest currecny unit (e.g. cents 100 cents to charge $1) that the Product Variant will cost."
 *     type: integer
 *   type:
 *     description: "The type of Money Amount. This can be one of the following: `default`, `sale`, or `cost`."
 *     type: string
 *     enum:
 *       - default
 *       - sale
 *       - cost
 *   starts_at:
 *     description: "The date with timezone that the Money Amount starts being valid. If this value is not set, the Money Amount is valid from the beginning of time."
 *     type: date-time
 *   ends_at:
 *     description: "The date with timezone that the Money Amount ends being valid. If this value is not set, the Money Amount is valid until the end of time."
 *     type: date-time
 *   min_quantity:
 *     description: "The minimum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities."
 *     type: integer
 *   max_quantity:
 *     description: "The maximum quantity that the Money Amount applies to. If this value is not set, the Money Amount applies to all quantities."
 *     type: integer
 *   customer_groups:
 *     description: "The Customer Groups that the Money Amount applies to. If this value is not set, the Money Amount applies to all Customer Groups."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/customer_group"
 *   variant_id:
 *     description: "The id of the Product Variant that the Money Amount belongs to."
 *     type: string
 *   region_id:
 *     description: "The id of the Region that the Money Amount is defined for."
 *     type: string
 *   region:
 *     description: "The Region that the Money Amount is defined for."
 *     anyOf:
 *       - $ref: "#/components/schemas/region"
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
 */
