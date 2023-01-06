import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class StagedJob {
  @PrimaryColumn()
  id: string

  @Column()
  event_name: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @DbAwareColumn({ type: "jsonb", default: {} })
  options: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "job")
  }
}

/**
 * @schema StagedJob
 * title: "Staged Job"
 * description: "A staged job resource"
 * type: object
 * required:
 *   - event_name
 * properties:
 *   id:
 *     type: string
 *     description: The staged job's ID
 *     example: job_01F0YET7BZTARY9MKN1SJ7AAXF
 *   event_name:
 *     description: "The name of the event"
 *     type: string
 *     example: order.placed
 *   data:
 *     description: Data necessary for the job
 *     type: object
 *     example: {}
 */
