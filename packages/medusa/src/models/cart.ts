import {
  Entity,
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

  @Column()
  receiver_email: string

  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address)
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @OneToMany(
    () => LineItem,
    lineItem => lineItem.cart
  )
  items: LineItem[]

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
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
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @OneToMany(
    () => PaymentSession,
    paymentSession => paymentSession.cart
  )
  payment_sessions: PaymentSession[]

  @Column({ nullable: true })
  payment_id: string

  @OneToOne(() => Payment)
  @JoinColumn({ name: "payment_id" })
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

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `cart_${id}`
  }
}
