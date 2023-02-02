import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { Fulfillment } from "./fulfillment"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class TrackingLink extends SoftDeletableEntity {
  @Column({ nullable: true })
  url: string | null

  @Column()
  tracking_number: string

  @Column()
  fulfillment_id: string

  @ManyToOne(() => Fulfillment, (ful) => ful.tracking_links)
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment?: Fulfillment | null

  @Column({ nullable: true })
  idempotency_key: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "tlink")
  }
}

/**
 * @schema TrackingLink
 * title: "Tracking Link"
 * description: "Tracking Link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment."
 * type: object
 * required:
 *   - tracking_number
 *   - fulfillment_id
 * properties:
 *   id:
 *     type: string
 *     description: The tracking link's ID
 *     example: tlink_01G8ZH853Y6TFXWPG5EYE81X63
 *   url:
 *     description: "The URL at which the status of the shipment can be tracked."
 *     type: string
 *     format: uri
 *   tracking_number:
 *     description: "The tracking number given by the shipping carrier."
 *     type: string
 *     format: RH370168054CN
 *   fulfillment_id:
 *     type: string
 *     description: "The id of the Fulfillment that the Tracking Link references."
 *     example: ful_01G8ZRTMQCA76TXNAT81KPJZRF
 *   fulfillment:
 *     description: Available if the relation `fulfillment` is expanded.
 *     $ref: "#/components/schemas/Fulfillment"
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of a process in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
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
