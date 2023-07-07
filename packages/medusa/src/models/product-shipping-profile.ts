import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  Unique,
  UpdateDateColumn,
} from "typeorm"
import { resolveDbType } from "../utils"

@Entity()
@Unique("idx_product_shipping_profile_profile_id_product_id_unique", [
  "product_id",
  "profile_id",
])
export class ProductShippingProfile {
  @Column({ nullable: true })
  product_id: string

  @Column({ nullable: true })
  profile_id: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @Index("idx_product_shipping_profile_deleted_at")
  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null
}

/**
 * @schema ProductShippingProfile
 * title: "Product Shipping Profile"
 * description: "Association between a product and a shipping profile."
 * type: object
 * required:
 *   - created_at
 *   - profile_id
 *   - product_id
 *   - updated_at
 *   - deleted_at
 * properties:
 *   profile_id:
 *     description: The id of the Shipping Profile.
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   product_id:
 *     description: the id of the Product.
 *     type: string
 *     example: prod_01G1G5V239ENSZ5MV4JAR737BM
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 */
