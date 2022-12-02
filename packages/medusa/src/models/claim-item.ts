import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { ClaimImage } from "./claim-image"
import { ClaimOrder } from "./claim-order"
import { ClaimTag } from "./claim-tag"
import { DbAwareColumn } from "../utils/db-aware-column"
import { LineItem } from "./line-item"
import { ProductVariant } from "./product-variant"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

export enum ClaimReason {
  MISSING_ITEM = "missing_item",
  WRONG_ITEM = "wrong_item",
  PRODUCTION_FAILURE = "production_failure",
  OTHER = "other",
}

@Entity()
export class ClaimItem extends SoftDeletableEntity {
  @OneToMany(() => ClaimImage, (ci) => ci.claim_item, {
    cascade: ["insert", "remove"],
  })
  images: ClaimImage[]

  @Index()
  @Column()
  claim_order_id: string

  @ManyToOne(() => ClaimOrder, (co) => co.claim_items)
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

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "citm")
  }
}

/**
 * @schema claim_item
 * title: "Claim Item"
 * description: "Represents a claimed item along with information about the reasons for the claim."
 * x-resourceId: claim_item
 * type: object
 * required:
 *   - claim_order_id
 *   - item_id
 *   - variant_id
 *   - reason
 *   - quantity
 * properties:
 *   id:
 *     type: string
 *     description: The claim item's ID
 *     example: citm_01G8ZH853Y6TFXWPG5EYE81X63
 *   images:
 *     type: array
 *     description: Available if the relation `images` is expanded.
 *     items:
 *       $ref: "#/components/schemas/claim_image"
 *   claim_order_id:
 *     description: The ID of the claim this item is associated with.
 *     type: string
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     type: object
 *   item_id:
 *     description: The ID of the line item that the claim item refers to.
 *     type: string
 *     example: item_01G8ZM25TN49YV9EQBE2NC27KC
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     $ref: "#/components/schemas/line_item"
 *   variant_id:
 *     description: "The ID of the product variant that is claimed."
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: A variant object. Available if the relation `variant` is expanded.
 *     type: object
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
 *     example: "I don't like it."
 *   quantity:
 *     description: "The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order."
 *     type: integer
 *     example: 1
 *   tags:
 *     description: "User defined tags for easy filtering and grouping. Available if the relation 'tags' is expanded."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/claim_tag"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
