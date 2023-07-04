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
 * @schema ClaimTag
 * title: "Claim Tag"
 * description: "Claim Tags are user defined tags that can be assigned to claim items for easy filtering and grouping."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - updated_at
 *   - value
 * properties:
 *   id:
 *     description: The claim tag's ID
 *     type: string
 *     example: ctag_01G8ZCC5Y63B95V6B5SHBZ91S4
 *   value:
 *     description: The value that the claim tag holds
 *     type: string
 *     example: Damaged
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
