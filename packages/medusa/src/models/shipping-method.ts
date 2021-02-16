import {
  Entity,
  Check,
  BeforeInsert,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from "typeorm"
import { ulid } from "ulid"

import { ClaimOrder } from "./claim-order"
import { Order } from "./order"
import { Cart } from "./cart"
import { Swap } from "./swap"
import { Return } from "./return"
import { ShippingOption } from "./shipping-option"
import { DraftOrder } from "./draft-order"

@Check(
  `"claim_order_id" IS NOT NULL OR "order_id" IS NOT NULL OR "cart_id" IS NOT NULL OR "swap_id" IS NOT NULL OR "return_id" IS NOT NULL`
)
@Check(`"price" >= 0`)
@Entity()
export class ShippingMethod {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  shipping_option_id: string

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(() => ClaimOrder)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  return_id: string

  @OneToOne(
    () => Return,
    ret => ret.shipping_method
  )
  @JoinColumn({ name: "return_id" })
  return_order: Return

  @ManyToOne(() => ShippingOption, { eager: true })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @Column({ type: "int" })
  price: number

  @Column({ type: "jsonb" })
  data: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `sm_${id}`
  }
}
