import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class ClaimTag {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  value: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `ctag_${id}`
  }
}

/**
 * @schema claim_tag
 * title: "Claim Tag"
 * description: "Claim Tags are user defined tags that can be assigned to claim items for easy filtering and grouping."
 * x-resourceId: claim_tag
 * properties:
 *   id:
 *     description: "The id of the claim tag. Will be prefixed by `ctag_`."
 *     type: string
 *   value:
 *     description: "The value that the claim tag holds"
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   update_at:
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
