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

@Entity()
export class PaymentSession {
  @PrimaryColumn()
  id: string

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  @JoinColumn({ name: "cart_id" })
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
