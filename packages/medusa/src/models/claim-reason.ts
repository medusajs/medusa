import {
    Entity,
    Index,
    BeforeInsert,
    Column,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    ManyToOne, 
    OneToMany,
    JoinColumn
  } from "typeorm"
  import { ulid } from "ulid"
  import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"
  
  @Entity()
  export class ClaimReason {
    @PrimaryColumn()
    id: string
  
    @Index({ unique: true })
    @Column()
    value: string
  
    @Column()
    label: string
  
    @Column({ nullable: true })
    description: string
  
    @Column({ nullable: true })
    parent_claim_reason_id: string
  
    @ManyToOne(() => ClaimReason, {cascade: ['soft-remove']}
    )
    @JoinColumn({ name: "parent_claim_reason_id" })
    parent_claim_reason: ClaimReason
  
    @OneToMany(
      () => ClaimReason,
      claim_reason => claim_reason.parent_claim_reason,
      { cascade: ["insert", 'soft-remove'] }
    )
    claim_reason_children: ClaimReason[]
  
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
      this.id = `cr_${id}`
    }
  }
  
  /**
   * @schema claim_reason
   * title: "Claim Reason"
   * description: "A Reason for why a claim was made. A Claim Reason can be used on Claim Items in order to indicate why a Line Item was claimed."
   * x-resourceId: claim_reason
   * properties:
   *   id:
   *     description: "The id of the Claim Reason will start with `cr_`."
   *     type: string
   *   description:
   *     description: "A description of the Claim Reason."
   *     type: string
   *   label:
   *     description: "A text that can be displayed to the Customer as a reason."
   *     type: string
   *   value:
   *     description: "The value to identify the reason by."
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
  