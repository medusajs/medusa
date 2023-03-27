import { generateEntityId } from "../utils/generate-entity-id"
import { BaseEntity } from "../interfaces/models/base-entity"
import { kebabCase } from "lodash"
import { Product } from "."
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm"

@Entity()
@Tree("materialized-path")
@Index(["parent_category_id", "rank"], { unique: true })
export class ProductCategory extends BaseEntity {
  static productCategoryProductJoinTable = "product_category_product"
  static treeRelations = ["parent_category", "category_children"]

  @Column()
  name: string

  @Index({ unique: true })
  @Column({ nullable: false })
  handle: string

  @Column()
  is_active: Boolean

  @Column()
  is_internal: Boolean

  // The materialized path column is added dynamically by typeorm. Commenting this here for it
  // to not be a mystery
  // https://github.com/typeorm/typeorm/blob/62518ae1226f22b2f230afa615532c92f1544f01/src/metadata-builder/EntityMetadataBuilder.ts#L615
  // @Column({ nullable: true, default: '' })
  // mpath: String

  @TreeParent()
  @JoinColumn({ name: "parent_category_id" })
  parent_category: ProductCategory | null

  // Typeorm also keeps track of the category's parent at all times.
  @Column()
  parent_category_id: string | null

  @TreeChildren({ cascade: true })
  category_children: ProductCategory[]

  @Column({ nullable: false, default: 0 })
  rank: number

  @ManyToMany(() => Product, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: ProductCategory.productCategoryProductJoinTable,
    joinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pcat")

    if (!this.handle) {
      this.handle = kebabCase(this.name)
    }
  }
}

/**
 * @schema ProductCategory
 * title: "ProductCategory"
 * description: "Represents a product category"
 * x-resourceId: ProductCategory
 * type: object
 * required:
 *   - category_children
 *   - created_at
 *   - handle
 *   - id
 *   - is_active
 *   - is_internal
 *   - mpath
 *   - name
 *   - parent_category_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The product category's ID
 *     type: string
 *     example: pcat_01G2SG30J8C85S4A5CHM2S1NS2
 *   name:
 *     description: The product category's name
 *     type: string
 *     example: Regular Fit
 *   handle:
 *     description: A unique string that identifies the Product Category - can for example be used in slug structures.
 *     type: string
 *     example: regular-fit
 *   mpath:
 *     description: A string for Materialized Paths - used for finding ancestors and descendents
 *     nullable: true
 *     type: string
 *     example: pcat_id1.pcat_id2.pcat_id3
 *   is_internal:
 *     type: boolean
 *     description: A flag to make product category an internal category for admins
 *     default: false
 *   is_active:
 *     type: boolean
 *     description: A flag to make product category visible/hidden in the store front
 *     default: false
 *   rank:
 *     type: integer
 *     description: An integer that depicts the rank of category in a tree node
 *     default: 0
 *   category_children:
 *     description: Available if the relation `category_children` are expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductCategory"
 *   parent_category_id:
 *     description: The ID of the parent category.
 *     nullable: true
 *     type: string
 *     default: null
 *   parent_category:
 *     description: A product category object. Available if the relation `parent_category` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/ProductCategory"
 *   products:
 *     description: Products associated with category. Available if the relation `products` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 */
