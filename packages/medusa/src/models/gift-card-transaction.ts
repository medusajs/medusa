import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { GiftCard } from "./gift-card"
import { Order } from "./order"

@Entity()
export class GiftCardTransaction {
  @PrimaryColumn()
  id: string

  @Column()
  gift_card_id: string

  @OneToOne(() => GiftCard)
  @JoinColumn({ name: "gift_card_id" })
  gift_card: GiftCard

  @Column()
  order_id: string

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column("int")
  amount: number

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `gct_${id}`
  }
}
