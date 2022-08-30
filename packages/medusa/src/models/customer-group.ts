import { BeforeInsert, Column, Entity, Index, ManyToMany } from "typeorm"

import { Customer } from "./customer"
import { DbAwareColumn } from "../utils/db-aware-column"
import { PriceList } from "./price-list"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class CustomerGroup extends SoftDeletableEntity {
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  name: string

  @ManyToMany(() => Customer, (customer) => customer.groups, {
    onDelete: "CASCADE",
  })
  customers: Customer[]

  @ManyToMany(() => PriceList, (priceList) => priceList.customer_groups, {
    onDelete: "CASCADE",
  })
  price_lists: PriceList[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cgrp")
  }
}
/**
 * @schema customer_group
 * title: "Customer Group"
 * description: "Represents a customer group"
 * x-resourceId: customer_group
 * required:
 *   - name
 * properties:
 *   id:
 *     type: string
 *     description: The customer group's ID
 *     example: cgrp_01G8ZH853Y6TFXWPG5EYE81X63
 *   name:
 *     type: string
 *     description: The name of the customer group
 *     example: VIP
 *   customers:
 *     type: array
 *     description: The customers that belong to the customer group. Available if the relation `customers` is expanded.
 *     items:
 *       type: object
 *       description: A customer object.
 *   price_lists:
 *     type: array
 *     description: The price lists that are associated with the customer group. Available if the relation `price_lists` is expanded.
 *     items:
 *       $ref: "#/components/schemas/price_list"
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

