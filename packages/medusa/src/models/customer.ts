import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  Unique,
} from "typeorm"

import { Address } from "./address"
import { CustomerGroup } from "./customer-group"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Order } from "./order"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Unique(["email", "has_account"])
export class Customer extends SoftDeletableEntity {
  @Index()
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string | null

  @OneToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @OneToMany(() => Address, (address) => address.customer)
  shipping_addresses: Address[]

  @Column({ nullable: true, select: false })
  password_hash: string

  @Column({ nullable: true })
  phone: string

  @Column({ default: false })
  has_account: boolean

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[]

  @JoinTable({
    name: "customer_group_customers",
    inverseJoinColumn: {
      name: "customer_group_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "customer_id",
      referencedColumnName: "id",
    },
  })
  @ManyToMany(() => CustomerGroup, (cg) => cg.customers, {
    onDelete: "CASCADE",
  })
  groups: CustomerGroup[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cus")
  }
}

/**
 * @schema Customer
 * title: "Customer"
 * description: "Represents a customer"
 * type: object
 * required:
 *   - billing_address_id
 *   - created_at
 *   - deleted_at
 *   - email
 *   - first_name
 *   - has_account
 *   - id
 *   - last_name
 *   - metadata
 *   - phone
 *   - updated_at
 * properties:
 *   id:
 *     description: The customer's ID
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   email:
 *     description: The customer's email
 *     type: string
 *     format: email
 *   first_name:
 *     description: The customer's first name
 *     nullable: true
 *     type: string
 *     example: Arno
 *   last_name:
 *     description: The customer's last name
 *     nullable: true
 *     type: string
 *     example: Willms
 *   billing_address_id:
 *     description: The customer's billing address ID
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: Available if the relation `billing_address` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   shipping_addresses:
 *     description: Available if the relation `shipping_addresses` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Address"
 *   phone:
 *     description: The customer's phone number
 *     nullable: true
 *     type: string
 *     example: 16128234334802
 *   has_account:
 *     description: Whether the customer has an account or not
 *     type: boolean
 *     default: false
 *   orders:
 *     description: Available if the relation `orders` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Order"
 *   groups:
 *     description: The customer groups the customer belongs to. Available if the relation `groups` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/CustomerGroup"
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
