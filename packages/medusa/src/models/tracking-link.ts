import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { Fulfillment } from "./fulfillment"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class TrackingLink extends SoftDeletableEntity {
  @Column({ nullable: true })
  url: string

  @Column()
  tracking_number: string

  @Column()
  fulfillment_id: string

  @ManyToOne(() => Fulfillment, (ful) => ful.tracking_links)
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment: Fulfillment

  @Column({ nullable: true })
  idempotency_key: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "tlink")
  }
}

/**
 * @schema tracking_link
 * title: "Tracking Link"
 * description: "Tracking Link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment."
 * x-resourceId: tracking_link
 * properties:
 *   id:
 *     description: "The id of the Tracking Link. This value will be prefixed with `tlink_`."
 *     type: string
 *   url:
 *     description: "The URL at which the status of the shipment can be tracked."
 *     type: string
 *   tracking_number:
 *     description: "The tracking number given by the shipping carrier."
 *     type: string
 *   fulfillment_id:
 *     description: "The id of the Fulfillment that the Tracking Link references."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
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
