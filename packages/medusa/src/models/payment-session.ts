import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Column,
  RelationId,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Cart } from "./cart"

@Entity()
export class PaymentSession {
  @PrimaryColumn()
  id: string

  @RelationId((p: PaymentSession) => p.cart)
  cart_id: string

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  cart: Cart

  @Column()
  provider_id: string

  @Column({ type: "jsonb" })
  data: any

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `ps_${id}`
  }
}
