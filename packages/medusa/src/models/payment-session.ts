import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Cart } from "./cart"

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  CANCELED = "canceled",
}

@Entity()
export class PaymentSession {
  @PrimaryColumn()
  id: string

  @Column()
  cart_id: number

  @ManyToOne(
    () => Cart,
    cart => cart.payment_sessions
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column()
  provider_id: string

  @Column({ type: "enum", enum: PaymentSessionStatus })
  status: string

  @Column({ type: "jsonb" })
  data: any

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `ps_${id}`
  }
}
