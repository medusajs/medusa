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
import _ from "lodash"

import { Product } from "./product"

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

/**
 * @schema product_collection
 * title: "Product Collection"
 * description: "Product Collections represents a group of Products that are related."
 * x-resourceId: product_collection
 * properties:
 *   id:
 *     description: "The id of the Product Collection. This value will be prefixed with `pcol_`."
 *     type: string
 *   title:
 *     description: "The title that the Product Collection is identified by."
 *     type: string
 *   handle:
 *     description: "A unique string that identifies the Product Collection - can for example be used in slug structures."
 *     type: string
 *   products:
 *     description: "The Products contained in the Product Collection."
 *     type: array
 *     items:
 *       type: object
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
