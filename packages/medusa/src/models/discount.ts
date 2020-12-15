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
import randomize from "randomatic"

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

  @Column({ nullable: true })
  discount_rule_id: string

  @ManyToOne(() => DiscountRule, { cascade: true, eager: true })
  @JoinColumn({ name: "discount_rule_id" })
  discount_rule: DiscountRule

  @Column()
  is_disabled: boolean

  @Column({ nullable: true })
  parent_discount_id: string

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "parent_discount_id" })
  parent_discount: Discount

  @Column({ type: "timestamp", default: "now()" })
  starts_at: Date

  @Column({ nullable: true })
  ends_at: Date

  @ManyToMany(() => Region)
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

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `disc_${id}`
  }
}
