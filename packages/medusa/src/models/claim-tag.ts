import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
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
 * properties:
 *   id:
 *     description: "The id of the claim tag. Will be prefixed by `ctag_`."
 *     type: string
 *   value:
 *     description: "The value that the claim tag holds"
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   update_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
