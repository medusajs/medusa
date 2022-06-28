import { BeforeInsert, Column, Entity, Index, ManyToMany } from "typeorm"
import { Customer } from "./customer"
import { PriceList } from "./price-list"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
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
 * properties:
 *   id:
 *     type: string
 *   name:
 *     type: string
 *   customers:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/customer"
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 */

