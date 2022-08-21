import { BeforeInsert, Column, Entity, Index } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ClaimTag extends SoftDeletableEntity {
  @Index()
  @Column()
  value: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ctag")
  }
}

/**
 * @schema claim_tag
 * title: "Claim Tag"
 * description: "Claim Tags are user defined tags that can be assigned to claim items for easy filtering and grouping."
 * x-resourceId: claim_tag
 * required:
 *   - value
 * properties:
 *   id:
 *     type: string
 *     description: The claim tag's ID
 *     example: ctag_01G8ZCC5Y63B95V6B5SHBZ91S4
 *   value:
 *     description: "The value that the claim tag holds"
 *     type: string
 *     example: Damaged
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
