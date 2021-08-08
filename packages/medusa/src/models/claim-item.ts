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
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

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

  @DbAwareColumn({ type: "enum", enum: ClaimReason })
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

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `citm_${id}`
  }
}

/**
 * @schema claim_item
 * title: "Claim Item"
 * description: "Represents a claimed item along with information about the reasons for the claim."
 * x-resourceId: claim_item
 * properties:
 *   id:
 *     type: string
 *   images:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/claim_image"
 *   claim_order_id:
 *     type: string
 *   item_id:
 *     type: string
 *   item:
 *     description: "The Line Item that the claim refers to"
 *     $ref: "#/components/schemas/line_item"
 *   variant_id:
 *     type: string
 *   variant:
 *     description: "The Product Variant that is claimed."
 *     $ref: "#/components/schemas/product_variant"
 *   reason:
 *     description: "The reason for the claim"
 *     type: string
 *     enum:
 *       - missing_item
 *       - wrong_item
 *       - production_failure
 *       - other
 *   note:
 *     description: "An optional note about the claim, for additional information"
 *     type: string
 *   quantity:
 *     description: "The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order."
 *     type: integer
 *   tags:
 *     description: "User defined tags for easy filtering and grouping."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/claim_tag"
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 */
