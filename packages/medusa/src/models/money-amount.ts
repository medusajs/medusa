import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Currency } from "./currency"
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

  @Column({ type: "int", nullable: true, default: null })
  sale_amount: number

  @Index()
  @Column({ nullable: true })
  variant_id: string

  @ManyToOne(() => ProductVariant)
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
  private beforeInsert() {
    if (this.id) return
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
 *   sale_amount:
 *     description: "An optional sale amount that the Product Variant will be available for when defined."
 *     type: integer
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
