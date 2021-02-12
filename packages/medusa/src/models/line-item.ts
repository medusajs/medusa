import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { Swap } from "./swap"
import { Cart } from "./cart"
import { Order } from "./order"
import { ClaimOrder } from "./claim-order"
import { ProductVariant } from "./product-variant"
import { DraftOrder } from "./draft-order"

@Check(`"fulfilled_quantity" <= "quantity"`)
@Check(`"shipped_quantity" <= "fulfilled_quantity"`)
@Check(`"returned_quantity" <= "quantity"`)
@Check(`"quantity" > 0`)
@Entity()
export class LineItem {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.items
  )
  @JoinColumn({ name: "order_id" })
  order: Order
  
  @Index()
  @Column({ nullable: true })
  draft_order_id: string

  @ManyToOne(
    () => DraftOrder,
    dorder => dorder.items
  )
  @JoinColumn({ name: "draft_order_id" })
  draft_order: DraftOrder

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(
    () => Swap,
    swap => swap.additional_items
  )
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  claim_order_id: string

  @ManyToOne(
    () => ClaimOrder,
    co => co.additional_items
  )
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  thumbnail: string

  @Column({ default: false })
  is_giftcard: boolean

  @Column({ default: true })
  should_merge: boolean

  @Column({ default: true })
  allow_discounts: boolean

  @Column({ nullable: true })
  has_shipping: boolean

  @Column({ type: "int" })
  unit_price: number

  @Index()
  @Column({ nullable: true })
  variant_id: string

  @ManyToOne(() => ProductVariant, { eager: true })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "int" })
  quantity: number

  @Column({ nullable: true, type: "int" })
  fulfilled_quantity: number

  @Column({ nullable: true, type: "int" })
  returned_quantity: number

  @Column({ nullable: true, type: "int" })
  shipped_quantity: number

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  refundable: number | null

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `item_${id}`
  }
}
