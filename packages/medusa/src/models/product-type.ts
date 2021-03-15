import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class ProductType {
  @PrimaryColumn()
  id: string

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
    this.id = `ptyp_${id}`
  }
}

/**
 * @schema product_type
 * title: "Product Type"
 * description: "Product Type can be added to Products for filtering and reporting purposes."
 * x-resourceId: product_type
 * properties:
 *   id:
 *     description: "The id of the Product Type. This value will be prefixed with `ptyp_`."
 *     type: string
 *   value:
 *     description: "The value that the Product Type represents (e.g. \"Clothing\")."
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
