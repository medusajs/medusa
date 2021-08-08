import {
  Entity,
  Index,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { ClaimItem } from "./claim-item"

import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

@Entity()
export class ClaimImage {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  claim_item_id: string

  @ManyToOne(
    () => ClaimItem,
    ci => ci.images
  )
  @JoinColumn({ name: "claim_item_id" })
  claim_item: ClaimItem

  @Column()
  url: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `cimg_${id}`
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
