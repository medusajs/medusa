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
 * @schema CustomerGroup
 * title: "Customer Group"
 * description: "Represents a customer group"
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - name
 *   - updated_at
 * properties:
 *   id:
 *     description: The customer group's ID
 *     type: string
 *     example: cgrp_01G8ZH853Y6TFXWPG5EYE81X63
 *   name:
 *     description: The name of the customer group
 *     type: string
 *     example: VIP
 *   customers:
 *     description: The customers that belong to the customer group. Available if the relation `customers` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Customer"
 *   price_lists:
 *     description: The price lists that are associated with the customer group. Available if the relation `price_lists` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PriceList"
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
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
