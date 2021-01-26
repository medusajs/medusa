import {
  Entity,
  Generated,
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

import { Fulfillment } from "./fulfillment"
import { LineItem } from "./line-item"

@Entity()
export class FulfillmentItem {
  @PrimaryColumn()
  fulfillment_id: string

  @PrimaryColumn()
  item_id: string

  @ManyToOne(() => Fulfillment)
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment: Fulfillment

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Column({ type: "int" })
  quantity: number
}
