import {
  Entity,
  BeforeInsert,
  Index,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { GiftCard } from "./gift-card"
import { Order } from "./order"

@Unique("gcuniq", ["gift_card_id", "order_id"])
@Entity()
export class GiftCardTransaction {
  @PrimaryColumn()
  id: string

  @Column()
  gift_card_id: string

  @ManyToOne(() => GiftCard)
  @JoinColumn({ name: "gift_card_id" })
  gift_card: GiftCard

  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order)
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
