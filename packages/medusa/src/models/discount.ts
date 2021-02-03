import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinTable,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { DiscountRule } from "./discount-rule"
import { Region } from "./region"

@Entity()
export class Discount {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  code: string

  @Column()
  is_dynamic: boolean

  @Index()
  @Column({ nullable: true })
  rule_id: string

  @ManyToOne(() => DiscountRule, { cascade: true, eager: true })
  @JoinColumn({ name: "rule_id" })
  rule: DiscountRule

  @Column()
  is_disabled: boolean

  @Column({ nullable: true })
  parent_discount_id: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "parent_discount_id" })
  parent_discount: Discount

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  starts_at: Date

  @Column({ type: "timestamptz", nullable: true })
  ends_at: Date

  @ManyToMany(() => Region, { cascade: true })
  @JoinTable({
    name: "discount_regions",
    joinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
  })
  regions: Region[]

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
    this.id = `disc_${id}`
    this.code = this.code.toUpperCase()
  }
}
