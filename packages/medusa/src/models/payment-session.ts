import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm"
import {ulid } from "ulid"
import { Cart } from "./cart"

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  ERROR = "error",
  CANCELED = "canceled",
}

@Unique("OneSelected", ["cart_id", "is_selected"])
@Entity()
export class PaymentSession {
  @PrimaryColumn()
  id: string

  @Column()
  cart_id: string

  @ManyToOne(
    () => Cart,
    cart => cart.payment_sessions
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Column()
  provider_id: string

  @Column({ nullable: true })
  is_selected: boolean

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
    if (this.id) return
    const id = ulid()
    this.id = `ps_${id}`
  }
}
