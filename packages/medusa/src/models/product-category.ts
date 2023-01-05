import { generateEntityId } from "../utils/generate-entity-id"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import {
  BeforeInsert,
  Index,
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  JoinColumn,
} from "typeorm"

@Entity()
@Tree("materialized-path")
export class ProductCategory extends SoftDeletableEntity {
  @Column()
  name: string

  @Index({ unique: true, where: "deleted_at IS NULL" })
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
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: ProductCategory | null

  // Typeorm also keeps track of the category's parent at all times.
  // TODO: Uncomment this if there is a usecase for accessing this.
  // @Column()
  // parent_category_id: ProductCategory

  @TreeChildren({ cascade: true })
  subCategories: ProductCategory[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pcat")
  }
}

/**
 * @schema productCategory
 * title: "ProductCategory"
 * description: "Represents a product category"
 * x-resourceId: productCategory
 * type: object
 * required:
 *   - name
 *   - handle
 * properties:
 *   id:
 *     type: string
 *     description: The product category's ID
 *     example: catg_01G2SG30J8C85S4A5CHM2S1NS2
 *   name:
 *     type: string
 *     description: The product category's name
 *     example: Regular Fit
 *   handle:
 *     description: "A unique string that identifies the Category - example: slug structures."
 *     type: string
 *     example: regular-fit
 *   path:
 *     type: string
 *     description: A string for Materialized Paths - used for finding ancestors and descendents
 *     example: catg_id1.catg_id2.catg_id3
 *   is_internal:
 *     type: boolean
 *     description: A flag to make product category an internal category for admins
 *     default: false
 *   is_active:
 *     type: boolean
 *     description: A flag to make product category visible/hidden in the store front
 *     default: false
 *   subCategories:
 *     description: Available if the relation `subCategories` are expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product category object.
 *   parentCategory:
 *     description: Available if the relation `parentCategory` is expanded.
 *     type: object
 *     description: A product category object.
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 */
