import {
  Entity,
  Generated,
  BeforeInsert,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm"
import { ulid } from "ulid"
import { Address } from "./address"

import { Cart } from "./cart"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { LineItem } from "./line-item"
import { Order } from "./order"
import { Payment } from "./payment"
import { Region } from "./region"
import { ShippingMethod } from "./shipping-method"

enum DraftOrderStatus {
  OPEN = "open",
  AWAITING = "awaiting",
  COMPLETED = "completed",
}

@Entity()
export class DraftOrder {
  @PrimaryColumn()
  id: string

  @Column({ type: "enum", enum: DraftOrderStatus, default: "open" })
  status: DraftOrderStatus

  @Index()
  @Column()
  @Generated("increment")
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column()
  customer_id: string

  @ManyToOne(() => Customer, { cascade: ["insert"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer
  
  @OneToMany(
    () => LineItem,
    lineItem => lineItem.draft_order,
    { cascade: ["insert", "remove"] }
  )
  items: LineItem[]

  @Column()
  email: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @ManyToMany(() => Discount, { cascade: ["insert"] })
  @JoinTable({
    name: "draft_order_discounts",
    joinColumn: {
      name: "draft_order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount[]

  @OneToMany(
    () => ShippingMethod,
    m => m.draft_order,
    { cascade: ["soft-remove", "remove"] }
  )
  shipping_methods: ShippingMethod[]

  @OneToMany(
    () => Payment,
    p => p.draft_order,
    { cascade: ["insert"] }
  )
  payments: Payment[]

  @Column({ nullable: true, type: "timestamptz" })
  canceled_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `dorder_${id}`
  }
}
