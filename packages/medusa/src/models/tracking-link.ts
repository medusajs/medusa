import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Fulfillment } from "./fulfillment"

@Entity()
export class TrackingLink {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  url: string

  @Column()
  tracking_number: string

  @Column()
  fulfillment_id: string

  @ManyToOne(
    () => Fulfillment,
    ful => ful.tracking_links
  )
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment: Fulfillment

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `tlink_${id}`
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
