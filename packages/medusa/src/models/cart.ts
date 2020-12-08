import {
  Entity,
  RelationId,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import randomize from "randomatic"

import { Region } from "./region"
import { Address } from "./address"
import { LineItem } from "./line-item"
import { Discount } from "./discount"
import { Customer } from "./customer"
import { PaymentSession } from "./payment-session"
import { Payment } from "./payment"
import { ShippingMethod } from "./shipping-method"

@Entity()
export class Cart {
  @PrimaryColumn()
  id: string

  @Column()
  email: string

  @Column({ nullable: true })
  @RelationId((c: Cart) => c.billing_address)
  billing_address_id: string

  @ManyToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Column({ nullable: true })
  @RelationId((c: Cart) => c.shipping_address)
  shipping_address_id: string

  @ManyToOne(() => Address)
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @OneToMany(
    () => LineItem,
    lineItem => lineItem.cart
  )
  items: LineItem[]

  @RelationId((c: Cart) => c.region)
  region_id: string

  @ManyToOne(() => Region)
  region: Region

  @ManyToMany(() => Discount)
  @JoinTable({
    name: "cart_discounts",
    joinColumn: {
      name: "cart_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount

  @Column({ nullable: true })
  @RelationId((c: Cart) => c.customer)
  customer_id: string

  @ManyToOne(() => Customer)
  customer: Customer

  @OneToMany(
    () => PaymentSession,
    paymentSession => paymentSession.cart
  )
  payment_sessions: PaymentSession[]

  @Column({ nullable: true })
  @RelationId((c: Cart) => c.payment)
  payment_id: string

  @OneToOne(() => Payment)
  payment: Payment

  @OneToMany(
    () => ShippingMethod,
    method => method.cart
  )
  shipping_methods: ShippingMethod[]

  @Column()
  is_swap: boolean

  @Column({ nullable: true })
  completed_at: Date

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
    const id = randomize("Aa0", 24)
    this.id = `cart_${id}`
  }
}
