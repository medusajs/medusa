import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  ManyToMany,
  Index,
  OneToMany,
} from "typeorm"
import { ulid } from "ulid"
import { Product } from "./product"
import _ from "lodash"

@Entity()
export class ProductCollection {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Index({ unique: true })
  @Column({ nullable: true })
  handle: string

  @OneToMany(
    () => Product,
    product => product.collection
  )
  products: Product[]

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
    this.id = `pcol_${id}`

    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}
