import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { LineItem } from "./line-item"
import { ClaimImage } from "./claim-image"
import { ClaimOrder } from "./claim-order"
import { ProductVariant } from "./product-variant"

export enum ClaimReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

@Entity()
export class ClaimItem {
  @PrimaryColumn()
  id: string

  @OneToMany(
    () => ClaimImage,
    ci => ci.claim_item
  )
  images: ClaimImage[]

  @Index()
  @Column()
  claim_order_id: string

  @ManyToOne(
    () => ClaimOrder,
    co => co.claim_items
  )
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "enum", enum: ClaimReason })
  reason: ClaimReason

  @Column({ nullable: true })
  note: string

  @Column({ type: "int" })
  quantity: number

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `citm_${id}`
  }
}
