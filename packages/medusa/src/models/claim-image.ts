import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"

import { ClaimItem } from "./claim-item"
import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ClaimImage extends SoftDeletableEntity {
  @Index()
  @Column()
  claim_item_id: string

  @ManyToOne(() => ClaimItem, (ci) => ci.images)
  @JoinColumn({ name: "claim_item_id" })
  claim_item: ClaimItem

  @Column()
  url: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cimg")
  }
}

/**
 * @schema ClaimImage
 * title: "Claim Image"
 * description: "Represents photo documentation of a claim."
 * type: object
 * required:
 *   - claim_item_id
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - updated_at
 *   - url
 * properties:
 *   id:
 *     description: The claim image's ID
 *     type: string
 *     example: cimg_01G8ZH853Y6TFXWPG5EYE81X63
 *   claim_item_id:
 *     description: The ID of the claim item associated with the image
 *     type: string
 *   claim_item:
 *     description: A claim item object. Available if the relation `claim_item` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ClaimItem"
 *   url:
 *     description: The URL of the image
 *     type: string
 *     format: uri
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
 */
