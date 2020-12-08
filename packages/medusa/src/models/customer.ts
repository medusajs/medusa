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
} from "typeorm"
import randomize from "randomatic"

import { Address } from "./address"
import { Order } from "./order"

@Entity()
export class Customer {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column({ nullable: true })
  billing_address_id: string

  @OneToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @OneToMany(
    () => Address,
    address => address.customer
  )
  shipping_addresses: Address[]

  @Column()
  password_hash: string

  @Column()
  phone: string

  @Column()
  has_account: boolean

  @OneToMany(
    () => Order,
    order => order.customer
  )
  orders: Order[]

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 10)
    this.id = `cus_${id}`
  }
}
