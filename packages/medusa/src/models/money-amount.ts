import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Currency } from "./currency"
import { ProductVariant } from "./product-variant"
import { Region } from "./region"

@Entity()
export class MoneyAmount {
  @PrimaryColumn()
  id: string

  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "int" })
  amount: number

  @Column({ type: "int", nullable: true, default: null })
  sale_amount: number

  @Column({ nullable: true })
  variant_id: string

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ nullable: true })
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `ma_${id}`
  }
}
