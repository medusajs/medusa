import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Region } from "./region"

@Entity()
export class GiftCard {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  code: string

  @Column()
  value: number

  @Column()
  balance: number

  @ManyToMany(() => Region)
  @JoinTable({
    name: "giftcard_regions",
    joinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
  })
  regions: Region[]

  @Column({ default: false })
  is_disabled: boolean

  @Column({
    type: "timestamp",
    nullable: true,
  })
  ends_at: Date

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `gift_${id}`
  }
}

//import mongoose from "mongoose"
//import { BaseModel } from "medusa-interfaces"
//import DiscountRule from "./schemas/discount-rule"
//
//class DiscountModel extends BaseModel {
//  static modelName = "Discount"
//
//  static schema = {
//    code: { type: String, required: true, unique: true },
//    is_dynamic: { type: Boolean, default: false },
//    is_giftcard: { type: Boolean, default: false },
//    discount_rule: { type: DiscountRule, required: true },
//    usage_count: { type: Number, default: 0 },
//    disabled: { type: Boolean, default: false },
//    starts_at: { type: Date },
//    ends_at: { type: Date },
//    regions: { type: [String], default: [] },
//    original_amount: { type: Number },
//    created: { type: String, default: Date.now },
//    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
//  }
//}
//
//export default DiscountModel
