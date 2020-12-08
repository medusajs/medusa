import {
  Entity,
  RelationId,
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
import randomize from "randomatic"

@Entity()
export class Store {
  @PrimaryColumn()
  id: string

  @Column({ default: "Medusa Store" })
  name: string

  @Column({ default: "usd" })
  default_currency: string

  @Column({ type: "jsonb", default: [] })
  currencies: string[]

  @Column({ nullable: true })
  swap_link_template: string

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 10)
    this.id = `store_${id}`
  }
}
