import { AfterLoad, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { BatchJobResultError, BatchJobResultStatDescriptor, BatchJobStatus } from "../types/batch-job"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { User } from "./user"
import { RequestQueryFields, Selector } from "../types/common"

@Entity()
export class BatchJob extends SoftDeletableEntity {
  @DbAwareColumn({ type: "text" })
  type: string

  @Column({ nullable: true })
  created_by: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  created_by_user: User

  @DbAwareColumn({ type: "jsonb", nullable: true })
  context: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  result: {
    count?: number
    advancement_count?: number
    progress?: number
    errors?: BatchJobResultError[]
    stat_descriptors?: BatchJobResultStatDescriptor[]
    file_key?: string
    file_size?: number
  } & Record<string, unknown>

  @Column({ type: "boolean", nullable: false, default: false })
  dry_run: boolean = false;

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  pre_processed_at?: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  processing_at?: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  confirmed_at?: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at?: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  canceled_at?: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  failed_at?: Date

  status: BatchJobStatus

  @AfterLoad()
  loadStatus(): void {
    /* Always keep the status order consistent. */
    if (this.pre_processed_at) {
      this.status = BatchJobStatus.PRE_PROCESSED
    }
    if (this.confirmed_at) {
      this.status = BatchJobStatus.CONFIRMED
    }
    if (this.processing_at) {
      this.status = BatchJobStatus.PROCESSING
    }
    if (this.completed_at) {
      this.status = BatchJobStatus.COMPLETED
    }
    if (this.canceled_at) {
      this.status = BatchJobStatus.CANCELED
    }
    if (this.failed_at) {
      this.status = BatchJobStatus.FAILED
    }

    this.status = this.status ?? BatchJobStatus.CREATED
  }

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "batch")
  }

  toJSON() {
    this.loadStatus()
    return this
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
 *      - pre_processed
 *      - processing
 *      - completed
 *      - canceled
 *      - failed
 *  created_by:
 *    description: "The unique identifier of the user that created the batch job."
 *    type: string
 *  context:
 *    description: "The context of the batch job, the type of the batch job determines what the context should contain."
 *    type: object
 *  dry_run:
 *    description: "Specify if the job must apply the modifications or not."
 *    type: boolean
 *    default: false
 *  result:
 *    description: "The result of the batch job."
 *    type: object
 *  pre_processed_at:
 *    description: "The date from which the job has been pre processed."
 *    type: string
 *    format: date-time
 *  confirmed_at:
 *    description: "The date when the confirmation has been done."
 *    type: string
 *    format: date-time
 *  completed_at:
 *    description: "The date of the completion."
 *    type: string
 *    format: date-time
  *  canceled_at:
 *    description: "The date of the concellation."
 *    type: string
 *    format: date-time
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
