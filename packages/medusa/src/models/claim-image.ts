import {
  Entity,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ClaimItem } from "./claim-item"
import { BaseEntity } from "./_base"

@Entity()
export class ClaimImage extends BaseEntity {
  prefixId = "cimg"

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
