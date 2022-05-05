import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { ClaimItem } from "./claim-item"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
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
 * @schema claim_image
 * title: "Claim Image"
 * description: "Represents photo documentation of a claim."
 * x-resourceId: claim_image
 * properties:
 *   id:
 *     type: string
 *   claim_item_id:
 *     type: string
 *   url:
 *     type: string
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
