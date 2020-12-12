import {
  Entity,
  RelationId,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import randomize from "randomatic"

import { Order } from "./order"
import { FulfillmentProvider } from "./fulfillment-provider"
import { FulfillmentItem } from "./fulfillment-item"
import { Swap } from "./swap"

@Entity()
export class Fulfillment {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  swap_id: string

  @OneToOne(
    () => Swap,
    swap => swap.fulfillment
  )
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Column({ nullable: true })
  order_id: string

  @ManyToOne(
    () => Order,
    o => o.returns
  )
  @JoinColumn({ name: "order_id" })
  order: Order

  @ManyToOne(() => FulfillmentProvider)
  @JoinColumn({ name: "provider_id" })
  provider: FulfillmentProvider

  @OneToMany(
    () => FulfillmentItem,
    i => i.fulfillment,
    { cascade: true }
  )
  items: FulfillmentItem[]

  @Column({ type: "jsonb", default: [] })
  tracking_numbers: string[]

  @Column({ type: "jsonb" })
  data: any

  @Column({ type: "timestamptz", nullable: true })
  shipped_at: Date

  @Column({ type: "timestamptz", nullable: true })
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
    this.id = `ful_${id}`
  }
}
//import mongoose from "mongoose"
//
//export default new mongoose.Schema({
//  created: { type: String, default: Date.now },
//  provider_id: { type: String, required: true },
//  items: { type: [mongoose.Schema.Types.Mixed], required: true },
//  data: { type: mongoose.Schema.Types.Mixed, default: {} },
//  tracking_numbers: { type: [String], default: [] },
//  shipped_at: { type: String },
//  is_canceled: { type: Boolean, default: false },
//  documents: { type: [String], default: [] },
//  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
//})
