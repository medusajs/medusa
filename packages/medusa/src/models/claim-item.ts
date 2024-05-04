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
  Relation,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { ClaimImage } from "./claim-image"
import { ClaimOrder } from "./claim-order"
import { ClaimTag } from "./claim-tag"
import { LineItem } from "./line-item"
import { ProductVariant } from "./product-variant"

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
  images: Relation<ClaimImage>[]

  @Index()
  @Column()
  claim_order_id: string

  @ManyToOne(() => ClaimOrder, (co) => co.claim_items)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: Relation<ClaimOrder>

  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem)
  @JoinColumn({ name: "item_id" })
  item: Relation<LineItem>

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: Relation<ProductVariant>

  @DbAwareColumn({ type: "enum", enum: ClaimReason })
  reason: Relation<ClaimReason>

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
  tags: Relation<ClaimTag>[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "citm")
  }
}

/**
 * @schema ClaimItem
 * title: "Claim Item"
 * description: "A claim item is an item created as part of a claim. It references an item in the order that should be exchanged or refunded."
 * type: object
 * required:
 *   - claim_order_id
 *   - created_at
 *   - deleted_at
 *   - id
 *   - item_id
 *   - metadata
 *   - note
 *   - quantity
 *   - reason
 *   - updated_at
 *   - variant_id
 * properties:
 *   id:
 *     description: The claim item's ID
 *     type: string
 *     example: citm_01G8ZH853Y6TFXWPG5EYE81X63
 *   images:
 *     description: The claim images that are attached to the claim item.
 *     type: array
 *     x-expandable: "images"
 *     items:
 *       $ref: "#/components/schemas/ClaimImage"
 *   claim_order_id:
 *     description: The ID of the claim this item is associated with.
 *     type: string
 *   claim_order:
 *     description: The details of the claim this item belongs to.
 *     x-expandable: "claim_order"
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimOrder"
 *   item_id:
 *     description: The ID of the line item that the claim item refers to.
 *     type: string
 *     example: item_01G8ZM25TN49YV9EQBE2NC27KC
 *   item:
 *     description: The details of the line item in the original order that this claim item refers to.
 *     x-expandable: "item"
 *     nullable: true
 *     $ref: "#/components/schemas/LineItem"
 *   variant_id:
 *     description: The ID of the product variant that is claimed.
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   variant:
 *     description: The details of the product variant to potentially replace the item in the original order.
 *     x-expandable: "variant"
 *     nullable: true
 *     $ref: "#/components/schemas/ProductVariant"
 *   reason:
 *     description: The reason for the claim
 *     type: string
 *     enum:
 *       - missing_item
 *       - wrong_item
 *       - production_failure
 *       - other
 *   note:
 *     description: An optional note about the claim, for additional information
 *     nullable: true
 *     type: string
 *     example: "I don't like it."
 *   quantity:
 *     description: The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order.
 *     type: integer
 *     example: 1
 *   tags:
 *     description: User defined tags for easy filtering and grouping.
 *     type: array
 *     x-expandable: "tags"
 *     items:
 *       $ref: "#/components/schemas/ClaimTag"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
