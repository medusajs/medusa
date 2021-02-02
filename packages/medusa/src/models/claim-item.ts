import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { LineItem } from "./line-item"
import { ClaimImage } from "./claim-image"
import { ClaimTag } from "./claim-tag"
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
    ci => ci.claim_item,
    { cascade: ["insert", "remove"] }
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

  @ManyToMany(() => ClaimTag, { cascade: ["insert"] })
  @JoinTable({
    name: "claim_item_tags",
    joinColumn: {
      name: "item_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags: ClaimTag[]

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
