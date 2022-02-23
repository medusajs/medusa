import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Address } from "./address"
import { CustomerGroup } from "./customer-group"
import { Order } from "./order"

@Entity()
export class Customer {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

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
  @ManyToMany(() => CustomerGroup, (cg) => cg.customers, { cascade: true })
  groups: CustomerGroup[]

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) {
      return
    }
    const id = ulid()
    this.id = `cus_${id}`
  }
}

/**
 * @schema customer
 * title: "Customer"
 * description: "Represents a customer"
 * x-resourceId: customer
 * properties:
 *   id:
 *     type: string
 *   email:
 *     type: string
 *   billing_address_id:
 *     type: string
 *   billing_address:
 *     description: "The Customer's billing address."
 *     anyOf:
 *       - $ref: "#/components/schemas/address"
 *   shipping_addresses:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/address"
 *   first_name:
 *     type: string
 *   last_name:
 *     type: string
 *   phone:
 *     type: string
 *   has_account:
 *     type: boolean
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
