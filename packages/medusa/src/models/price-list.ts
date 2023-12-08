import { PriceListStatus, PriceListType } from "@medusajs/utils"
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { FeatureFlagColumn } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils/generate-entity-id"
import { CustomerGroup } from "./customer-group"
import { MoneyAmount } from "./money-amount"

@Entity()
export class PriceList extends SoftDeletableEntity {
  @Column()
  name: string

  @Column()
  description: string

  @DbAwareColumn({ type: "enum", enum: PriceListType, default: "sale" })
  type: PriceListType

  @DbAwareColumn({ type: "enum", enum: PriceListStatus, default: "draft" })
  status: PriceListStatus

  @Column({
    type: resolveDbType("timestamptz"),
    nullable: true,
  })
  starts_at: Date | null

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  ends_at: Date | null

  @JoinTable({
    name: "price_list_customer_groups",
    joinColumn: {
      name: "price_list_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer_group_id",
      referencedColumnName: "id",
    },
  })
  @ManyToMany(() => CustomerGroup, (cg) => cg.price_lists, {
    onDelete: "CASCADE",
  })
  customer_groups: CustomerGroup[]

  @OneToMany(() => MoneyAmount, (moneyAmount) => moneyAmount.price_list, {
    onDelete: "CASCADE",
  })
  prices: MoneyAmount[]

  @FeatureFlagColumn(TaxInclusivePricingFeatureFlag.key, { default: false })
  includes_tax: boolean

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): undefined | void {
    this.id = generateEntityId(this.id, "pl")
  }
}

/**
 * @schema PriceList
 * title: "Price List"
 * description: "A Price List represents a set of prices that override the default price for one or more product variants."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - description
 *   - ends_at
 *   - id
 *   - name
 *   - starts_at
 *   - status
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The price list's ID
 *     type: string
 *     example: pl_01G8X3CKJXCG5VXVZ87H9KC09W
 *   name:
 *     description: The price list's name
 *     type: string
 *     example: VIP Prices
 *   description:
 *     description: The price list's description
 *     type: string
 *     example: Prices for VIP customers
 *   type:
 *     description: The type of Price List. This can be one of either `sale` or `override`.
 *     type: string
 *     enum:
 *       - sale
 *       - override
 *     default: sale
 *   status:
 *     description: The status of the Price List
 *     type: string
 *     enum:
 *       - active
 *       - draft
 *     default: draft
 *   starts_at:
 *     description: The date with timezone that the Price List starts being valid.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   ends_at:
 *     description: The date with timezone that the Price List stops being valid.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   customer_groups:
 *     description: The details of the customer groups that the Price List can apply to.
 *     type: array
 *     x-expandable: "customer_groups"
 *     items:
 *       $ref: "#/components/schemas/CustomerGroup"
 *   prices:
 *     description: The prices that belong to the price list, represented as a Money Amount.
 *     type: array
 *     x-expandable: "prices"
 *     items:
 *       $ref: "#/components/schemas/MoneyAmount"
 *   includes_tax:
 *     description: "Whether the price list prices include tax"
 *     type: boolean
 *     x-featureFlag: "tax_inclusive_pricing"
 *     default: false
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
