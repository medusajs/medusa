import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { Fulfillment } from "./fulfillment"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
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
 * @schema TrackingLink
 * title: "Tracking Link"
 * description: "Tracking Link holds information about tracking numbers for a Fulfillment. Tracking Links can optionally contain a URL that can be visited to see the status of the shipment."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - fulfillment_id
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - tracking_number
 *   - updated_at
 *   - url
 * properties:
 *   id:
 *     description: The tracking link's ID
 *     type: string
 *     example: tlink_01G8ZH853Y6TFXWPG5EYE81X63
 *   url:
 *     description: The URL at which the status of the shipment can be tracked.
 *     nullable: true
 *     type: string
 *     format: uri
 *   tracking_number:
 *     description: The tracking number given by the shipping carrier.
 *     type: string
 *     format: RH370168054CN
 *   fulfillment_id:
 *     description: The id of the Fulfillment that the Tracking Link references.
 *     type: string
 *     example: ful_01G8ZRTMQCA76TXNAT81KPJZRF
 *   fulfillment:
 *     description: Available if the relation `fulfillment` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Fulfillment"
 *   idempotency_key:
 *     description: Randomly generated key used to continue the completion of a process in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/modules/carts-and-checkout/cart.md#idempotency-key
 *       description: Learn more how to use the idempotency key.
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
