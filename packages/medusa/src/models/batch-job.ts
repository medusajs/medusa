import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"
import { BatchJobStatus } from "../types/batch-job"
import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class BatchJob extends SoftDeletableEntity {
  @DbAwareColumn({ type: "text" })
  type: string

  @DbAwareColumn({ type: "enum", enum: BatchJobStatus })
  status: BatchJobStatus

  @Column({ type: "text", nullable: true })
  created_by: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  context: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  result: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "batch")
  }
}

/**
 * @schema batch_job
 * title: "Batch Job"
 * description: "A Batch Job."
 * x-resourceId: batch_job
 * properties:
 *  id:
 *    description: "The unique identifier for the batch job."
 *    type: string
 *  type:
 *    description: "The type of batch job."
 *    type: string
 *    enum:
 *      - product_import
 *      - product_export
 *  status:
 *    description: "The status of the batch job."
 *    type: string
 *    enum:
 *      - created
 *      - processing
 *      - awaiting_confirmation
 *      - completed
 *  created_by:
 *    description: "The unique identifier of the user that created the batch job."
 *    type: string
 *  context:
 *    description: "The context of the batch job, the type of the batch job determines what the context should contain."
 *    type: object
 *  result:
 *    description: "The result of the batch job."
 *    type: object
 *  created_at:
 *    description: "The date with timezone at which the resource was created."
 *    type: string
 *    format: date-time
 *  updated_at:
 *    description: "The date with timezone at which the resource was last updated."
 *    type: string
 *    format: date-time
 *  deleted_at:
 *    description: "The date with timezone at which the resource was deleted."
 *    type: string
 *    format: date-time
 */
