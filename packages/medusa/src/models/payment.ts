import {
  Entity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Swap } from "./swap"
import { Currency } from "./currency"
import { Cart } from "./cart"
import { Order } from "./order"

@Entity()
export class Payment {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  swap_id: string

  @OneToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.payments
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ type: "int" })
  amount: number

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int", default: 0 })
  amount_refunded: number

  @Column()
  provider_id: string

  @Column({ type: "jsonb" })
  data: any

  @Column({ nullable: true })
  captured_at: Date

  @Column({ nullable: true })
  canceled_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `pay_${id}`
  }
}
