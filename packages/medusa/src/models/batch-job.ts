import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import {
  BatchJobResultError,
  BatchJobResultStatDescriptor,
  BatchJobStatus,
} from "../types/batch-job"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { User } from "./user"
import { generateEntityId } from "../utils/generate-entity-id"

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
  dry_run = false

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
 * type: object
 * required:
 *   - type
 * properties:
 *  id:
 *    type: string
 *    description: "The unique identifier for the batch job."
 *    example: batch_01G8T782965PYFG0751G0Z38B4
 *  type:
 *    type: string
 *    description: "The type of batch job."
 *    enum:
 *      - product-import
 *      - product-export
 *  status:
 *    type: string
 *    description: "The status of the batch job."
 *    enum:
 *      - created
 *      - pre_processed
 *      - confirmed
 *      - processing
 *      - completed
 *      - canceled
 *      - failed
 *    default: created
 *  created_by:
 *    type: string
 *    description: "The unique identifier of the user that created the batch job."
 *    example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *  created_by_user:
 *    description: A user object. Available if the relation `created_by_user` is expanded.
 *    type: object
 *  context:
 *    type: object
 *    description: "The context of the batch job, the type of the batch job determines what the context should contain."
 *    example:
 *      shape:
 *        prices:
 *          - region: null
 *            currency_code: "eur"
 *        dynamicImageColumnCount: 4
 *        dynamicOptionColumnCount: 2
 *      list_config:
 *        skip: 0
 *        take: 50
 *        order:
 *          created_at: "DESC"
 *        relations:
 *          - variants
 *          - variant.prices
 *          - images
 *  dry_run:
 *    type: boolean
 *    description: "Specify if the job must apply the modifications or not."
 *    default: false
 *  result:
 *    type: object
 *    description: "The result of the batch job."
 *    properties:
 *      count:
 *        type: number
 *      advancement_count:
 *        type: number
 *      progress:
 *        type: number
 *      errors:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *          code:
 *            oneOf:
 *              - type: string
 *              - type: number
 *          err:
 *            type: array
 *      stat_descriptors:
 *        type: object
 *        properties:
 *          key:
 *            type: string
 *          name:
 *            type: string
 *          message:
 *            type: string
 *      file_key:
 *        type: string
 *      file_size:
 *        type: number
 *    example:
 *      errors:
 *        - err: []
 *          code: "unknown"
 *          message: "Method not implemented."
 *      stat_descriptors:
 *        - key: "product-export-count"
 *          name: "Product count to export"
 *          message: "There will be 8 products exported by this action"
 *  pre_processed_at:
 *    type: string
 *    description: "The date from which the job has been pre processed."
 *    format: date-time
 *  processing_at:
 *    type: string
 *    description: "The date the job is processing at."
 *    format: date-time
 *  confirmed_at:
 *    type: string
 *    description: "The date when the confirmation has been done."
 *    format: date-time
 *  completed_at:
 *    type: string
 *    description: "The date of the completion."
 *    format: date-time
 *  canceled_at:
 *    type: string
 *    description: "The date of the concellation."
 *    format: date-time
 *  failed_at:
 *    type: string
 *    description: "The date when the job failed."
 *    format: date-time
 *  created_at:
 *    type: string
 *    description: "The date with timezone at which the resource was created."
 *    format: date-time
 *  updated_at:
 *    type: string
 *    description: "The date with timezone at which the resource was last updated."
 *    format: date-time
 *  deleted_at:
 *    type: string
 *    description: "The date with timezone at which the resource was deleted."
 *    format: date-time
 */
