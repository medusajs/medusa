import { RestoreReturn, SoftDeleteReturn } from "../dal"
import {
  CreateProductCategoryDTO,
  CreateProductCollectionDTO,
  CreateProductDTO,
  CreateProductOptionDTO,
  CreateProductTagDTO,
  CreateProductTypeDTO,
  CreateProductVariantDTO,
  FilterableProductCategoryProps,
  FilterableProductCollectionProps,
  FilterableProductOptionProps,
  FilterableProductProps,
  FilterableProductTagProps,
  FilterableProductTypeProps,
  FilterableProductVariantProps,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductOptionDTO,
  ProductTagDTO,
  ProductTypeDTO,
  ProductVariantDTO,
  UpdateProductCategoryDTO,
  UpdateProductCollectionDTO,
  UpdateProductDTO,
  UpdateProductOptionDTO,
  UpdateProductTagDTO,
  UpdateProductTypeDTO,
  UpdateProductVariantDTO,
  UpsertProductCollectionDTO,
  UpsertProductDTO,
  UpsertProductOptionDTO,
  UpsertProductVariantDTO,
} from "./common"

import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"

/**
 * The main service interface for the product module.
 */
export interface IProductModuleService extends IModuleService {
  /**
   * This method is used to retrieve a product by its ID
   *
   * @param {string} productId - The ID of the product to retrieve.
   * @param {FindConfig<ProductDTO>} config -
   * The configurations determining how the product is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The retrieved product.
   *
   * @example
   * A simple example that retrieves a product by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProduct (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const product = await productModule.retrieve(id)
   *
   *   // do something with the product or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProduct (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const product = await productModule.retrieve(id, {
   *     relations: ["categories"]
   *   })
   *
   *   // do something with the product or return it
   * }
   * ```
   */
  retrieve(
    productId: string,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO>

  /**
   * This method is used to retrieve a paginated list of price sets based on optional filters and configuration.
   *
   * @param {FilterableProductProps} filters - The filters to apply on the retrieved products.
   * @param {FindConfig<ProductDTO>} config -
   * The configurations determining how the products are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The list of products.
   *
   * @example
   * To retrieve a list of products using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.list({
   *     id: ids
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the products:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.list({
   *     id: ids
   *   }, {
   *     relations: ["categories"]
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.list({
   *     id: ids
   *   }, {
   *     relations: ["categories"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.list({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         q: title
   *       }
   *     ]
   *   }, {
   *     relations: ["categories"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   */
  list(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method is used to retrieve a paginated list of products along with the total count of available products satisfying the provided filters.
   *
   * @param {FilterableProductProps} filters - The filters to apply on the retrieved products.
   * @param {FindConfig<ProductDTO>} config -
   * The configurations determining how the products are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The list of products along with the total count.
   *
   * @example
   * To retrieve a list of products using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [products, count] = await productModule.listAndCount({
   *     id: ids
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the products:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [products, count] = await productModule.listAndCount({
   *     id: ids
   *   }, {
   *     relations: ["categories"]
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [products, count] = await productModule.listAndCount({
   *     id: ids
   *   }, {
   *     relations: ["categories"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProducts (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [products, count] = await productModule.listAndCount({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         q: title
   *       }
   *     ]
   *   }, {
   *     relations: ["categories"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the products or return them
   * }
   * ```
   */
  listAndCount(
    filters?: FilterableProductProps,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<[ProductDTO[], number]>

  /**
   * This method is used to create a list of products.
   *
   * @param {CreateProductDTO[]} data - The products to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The list of created products.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createProduct (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.create([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the products or return them
   * }
   */
  create(
    data: CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method is used to create a product.
   *
   * @param {CreateProductDTO} data - The product to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The created product.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createProduct (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const product = await productModule.create(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the product or return it
   * }
   */
  create(data: CreateProductDTO, sharedContext?: Context): Promise<ProductDTO>

  /**
   * This method updates existing products, or creates new ones if they don't exist.
   *
   * @param {CreateProductDTO[]} data - The attributes to update or create for each product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The updated and created products.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upserProduct (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdProducts = await productModule.upsert([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the products or return them
   * }
   */
  upsert(
    data: UpsertProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method updates the product if it exists, or creates a new ones if it doesn't.
   *
   * @param {CreateProductDTO} data - The attributes to update or create for the new product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The updated or created product.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upserProduct (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdProduct = await productModule.upsert(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the product or return it
   * }
   */
  upsert(
    data: UpsertProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method is used to update a product.
   *
   * @param {string} id - The ID of the product to be updated.
   * @param {UpdateProductDTO} data - The attributes of the product to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The updated product.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateProduct (id: string, title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const product = await productModule.update(id, {
   *       title
   *     }
   *   )
   *
   *   // do something with the product or return it
   * }
   */
  update(
    id: string,
    data: UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductDTO>

  /**
   * This method is used to update a list of products determined by the selector filters.
   *
   * @param {FilterableProductProps} selector - The filters that will determine which products will be updated.
   * @param {UpdateProductDTO} data - The attributes to be updated on the selected products
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The updated products.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateProduct (id: string, title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const products = await productModule.update({id}, {
   *       title
   *     }
   *   )
   *
   *   // do something with the products or return them
   * }
   */
  update(
    selector: FilterableProductProps,
    data: UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method is used to delete products. Unlike the {@link softDelete} method, this method will completely remove the products and they can no longer be accessed or retrieved.
   *
   * @param {string[]} productIds - The IDs of the products to be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the products are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.delete(ids)
   * }
   */
  delete(productIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method is used to delete products. Unlike the {@link delete} method, this method won't completely remove the product. It can still be accessed or retrieved using methods like {@link retrieve} if you pass the `withDeleted` property to the `config` object parameter.
   *
   * The soft-deleted products can be restored using the {@link restore} method.
   *
   * @param {string[]} productIds - The IDs of the products to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to soft delete along with the each of the products. You can pass to its `returnLinkableKeys`
   * property any of the product's relation attribute names, such as `variant_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were also soft deleted, such as the ID of associated product variants. The object's keys are the ID attribute names of the product entity's relations, such as `variant_id`, and its value is an array of strings, each being the ID of a record associated with the product through this relation, such as the IDs of associated product variants.
   *
   * If there are no related records, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.softDelete(ids)
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore products which were deleted using the {@link softDelete} method.
   *
   * @param {string[]} productIds - The IDs of the products to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to restore along with each of the products. You can pass to its `returnLinkableKeys`
   * property any of the product's relation attribute names, such as `variant_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were restored, such as the ID of associated product variants. The object's keys are the ID attribute names of the product entity's relations, such as `variant_id`, and its value is an array of strings, each being the ID of the record associated with the product through this relation, such as the IDs of associated product variants.
   *
   * If there are no related records that were restored, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function restoreProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.restore(ids, {
   *     returnLinkableKeys: ["variant_id"]
   *   })
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  restore<TReturnableLinkableKeys extends string = string>(
    productIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a tag by its ID.
   *
   * @param {string} tagId - The ID of the tag to retrieve.
   * @param {FindConfig<ProductTagDTO>} config -
   * The configurations determining how the product tag is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product tag.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTagDTO>} The retrieved product tag.
   *
   * @example
   * A simple example that retrieves a product tag by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagId: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTag = await productModule.retrieveTag(tagId)
   *
   *   // do something with the product tag or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagId: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTag = await productModule.retrieveTag(tagId, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product tag or return it
   * }
   * ```
   */
  retrieveTag(
    tagId: string,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<ProductTagDTO>

  /**
   * This method is used to retrieve a paginated list of tags based on optional filters and configuration.
   *
   * @param {FilterableProductTagProps} filters - The filters applied on the retrieved product tags.
   * @param {FindConfig<ProductTagDTO>} config -
   * The configurations determining how the product tags are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product tag.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTagDTO[]>} The list of product tags.
   *
   * @example
   * To retrieve a list of product tags using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.listTags({
   *     id: tagIds
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product tags:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.listTags({
   *     id: tagIds
   *   }, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.listTags({
   *     id: tagIds
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[], value: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.listTags({
   *     $and: [
   *       {
   *         id: tagIds
   *       },
   *       {
   *         value
   *       }
   *     ]
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   */
  listTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  /**
   * This method is used to retrieve a paginated list of product tags along with the total count of available product tags satisfying the provided filters.
   *
   * @param {FilterableProductTagProps} filters - The filters applied on the retrieved product tags.
   * @param {FindConfig<ProductTagDTO>} config -
   * The configurations determining how the product tags are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product tag.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductTagDTO[], number]>} The list of product tags along with the total count.
   *
   * @example
   * To retrieve a list of product tags using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTags, count] = await productModule.listAndCountTags({
   *     id: tagIds
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product tags:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTags, count] = await productModule.listAndCountTags({
   *     id: tagIds
   *   }, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTags, count] = await productModule.listAndCountTags({
   *     id: tagIds
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTag (tagIds: string[], value: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTags, count] = await productModule.listAndCountTags({
   *     $and: [
   *       {
   *         id: tagIds
   *       },
   *       {
   *         value
   *       }
   *     ]
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product tags or return them
   * }
   * ```
   */
  listAndCountTags(
    filters?: FilterableProductTagProps,
    config?: FindConfig<ProductTagDTO>,
    sharedContext?: Context
  ): Promise<[ProductTagDTO[], number]>

  /**
   * This method is used to create product tags.
   *
   * @param {CreateProductTagDTO[]} data - The product tags to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTagDTO[]>} The list of product tags.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createProductTags (values: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.createTags(
   *     values.map((value) => ({
   *       value
   *     }))
   *   )
   *
   *   // do something with the product tags or return them
   * }
   */
  createTags(
    data: CreateProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  /**
   * This method is used to update existing product tags.
   *
   * @param {UpdateProductTagDTO[]} data - The product tags to be updated, each having the attributes that should be updated in a product tag.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTagDTO[]>} The list of updated product tags.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateProductTag (id: string, value: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTags = await productModule.updateTags([
   *     {
   *       id,
   *       value
   *     }
   *   ])
   *
   *   // do something with the product tags or return them
   * }
   */
  updateTags(
    data: UpdateProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTagDTO[]>

  /**
   * This method is used to delete product tags by their ID.
   *
   * @param {string[]} productTagIds - The IDs of the product tags to be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the product tags are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProductTags (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteTags(ids)
   *
   * }
   */
  deleteTags(productTagIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method is used to retrieve a product type by its ID.
   *
   * @param {string} typeId - The ID of the product type to retrieve.
   * @param {FindConfig<ProductTypeDTO>} config -
   * The configurations determining how the product type is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO>} The retrieved product type.
   *
   * @example
   * A simple example that retrieves a product type by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductType (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productType = await productModule.retrieveType(id)
   *
   *   // do something with the product type or return it
   * }
   * ```
   *
   * To specify attributes that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductType (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productType = await productModule.retrieveType(id, {
   *     select: ["value"]
   *   })
   *
   *   // do something with the product type or return it
   * }
   * ```
   */
  retrieveType(
    typeId: string,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<ProductTypeDTO>

  /**
   * This method is used to retrieve a paginated list of product types based on optional filters and configuration.
   *
   * @param {FilterableProductTypeProps} filters - The filters to apply on the retrieved product types.
   * @param {FindConfig<ProductTypeDTO>} config -
   * The configurations determining how the product types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO[]>} The list of product types.
   *
   * @example
   * To retrieve a list of product types using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.listTypes({
   *     id: ids
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the product types:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.listTypes({
   *     id: ids
   *   }, {
   *     select: ["value"]
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.listTypes({
   *     id: ids
   *   }, {
   *     select: ["value"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[], value: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.listTypes({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         value
   *       }
   *     ]
   *   }, {
   *     select: ["value"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   */
  listTypes(
    filters?: FilterableProductTypeProps,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  /**
   * This method is used to retrieve a paginated list of product types along with the total count of available product types satisfying the provided filters.
   *
   * @param {FilterableProductTypeProps} filters - The filters to be applied on the retrieved product type.
   * @param {FindConfig<ProductTypeDTO>} config -
   * The configurations determining how the product types are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductTypeDTO[], number]>} The list of product types along with their total count.
   *
   * @example
   * To retrieve a list of product types using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTypes, count] = await productModule.listAndCountTypes({
   *     id: ids
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * To specify attributes that should be retrieved within the product types:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTypes, count] = await productModule.listAndCountTypes({
   *     id: ids
   *   }, {
   *     select: ["value"]
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTypes, count] = await productModule.listAndCountTypes({
   *     id: ids
   *   }, {
   *     select: ["value"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductTypes (ids: string[], value: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productTypes, count] = await productModule.listAndCountTypes({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         value
   *       }
   *     ]
   *   }, {
   *     select: ["value"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product types or return them
   * }
   * ```
   */
  listAndCountTypes(
    filters?: FilterableProductTypeProps,
    config?: FindConfig<ProductTypeDTO>,
    sharedContext?: Context
  ): Promise<[ProductTypeDTO[], number]>

  /**
   * This method is used to create a product type.
   *
   * @param {CreateProductTypeDTO[]} data - The product types to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<ProductTypeDTO[]>} The list of created product types.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createProductType (value: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.createTypes([
   *     {
   *       value
   *     }
   *   ])
   *
   *   // do something with the product types or return them
   * }
   */
  createTypes(
    data: CreateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  /**
   * This method is used to update a product type
   *
   * @param {UpdateProductTypeDTO[]} data - The product types to be updated, each having the attributes that should be updated in the product type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO[]>} The list of updated product types.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateProductType (id: string, value: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productTypes = await productModule.updateTypes([
   *     {
   *       id,
   *       value
   *     }
   *   ])
   *
   *   // do something with the product types or return them
   * }
   */
  updateTypes(
    data: UpdateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  /**
   * This method is used to delete a product type.
   *
   * @param {string[]} productTypeIds - The IDs of the product types to be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the product types are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProductTypes (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteTypes(ids)
   * }
   */
  deleteTypes(productTypeIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method is used to retrieve a product option by its ID.
   *
   * @param {string} optionId - The ID of the product option to retrieve.
   * @param {FindConfig<ProductOptionDTO>} config -
   * The configurations determining how the product option is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO>} The retrieved product option.
   *
   * @example
   * A simple example that retrieves a product option by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOption (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOption = await productModule.retrieveOption(id)
   *
   *   // do something with the product option or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOption (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOption = await productModule.retrieveOption(id, {
   *     relations: ["product"]
   *   })
   *
   *   // do something with the product option or return it
   * }
   * ```
   */
  retrieveOption(
    optionId: string,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  /**
   * This method is used to retrieve a paginated list of product options based on optional filters and configuration.
   *
   * @param {FilterableProductOptionProps} filters - The filters applied on the retrieved product options.
   * @param {FindConfig<ProductOptionDTO>} config -
   * The configurations determining how the product options are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO[]>} The list of product options.
   *
   * @example
   * To retrieve a list of product options using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOptions = await productModule.listOptions({
   *     id: ids
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product types:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOptions = await productModule.listOptions({
   *     id: ids
   *   }, {
   *     relations: ["product"]
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOptions = await productModule.listOptions({
   *     id: ids
   *   }, {
   *     relations: ["product"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const productOptions = await productModule.listOptions({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title
   *       }
   *     ]
   *   }, {
   *     relations: ["product"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   */
  listOptions(
    filters?: FilterableProductOptionProps,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  /**
   * This method is used to retrieve a paginated list of product options along with the total count of available product options satisfying the provided filters.
   *
   * @param {FilterableProductOptionProps} filters - The filters applied on the retrieved product options.
   * @param {FindConfig<ProductOptionDTO>} config -
   * The configurations determining how the product options are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductOptionDTO[], number]>} The list of product options along with the total count.
   *
   * @example
   * To retrieve a list of product options using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productOptions, count] = await productModule.listAndCountOptions({
   *     id: ids
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product types:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productOptions, count] = await productModule.listAndCountOptions({
   *     id: ids
   *   }, {
   *     relations: ["product"]
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productOptions, count] = await productModule.listAndCountOptions({
   *     id: ids
   *   }, {
   *     relations: ["product"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductOptions (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [productOptions, count] = await productModule.listAndCountOptions({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title
   *       }
   *     ]
   *   }, {
   *     relations: ["product"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product options or return them
   * }
   * ```
   */
  listAndCountOptions(
    filters?: FilterableProductOptionProps,
    config?: FindConfig<ProductOptionDTO>,
    sharedContext?: Context
  ): Promise<[ProductOptionDTO[], number]>

  /**
   * This method is used to create product options.
   *
   * @param {CreateProductOptionDTO[]} data - The product options to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO[]>} The list of created product options.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createOptions (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const options = await productModule.createOptions([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the product options or return them
   * }
   *
   */
  createOptions(
    data: CreateProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  /**
   * This method is used to create a product option.
   *
   * @param {CreateProductOptionDTO} data - The product option to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO>} The created product option.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createOption (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const option = await productModule.createOptions(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the product option or return them
   * }
   *
   */
  createOptions(
    data: CreateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  /**
   * This method updates existing options, or creates new ones if they don't exist.
   *
   * @param {UpsertProductOptionDTO[]} data - The attributes to update or create for each option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO[]>} The updated and created options.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertOptions (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdOptions = await productModule.upsertOptions([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the options or return them
   * }
   */
  upsertOptions(
    data: UpsertProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  /**
   * This method updates an existing option, or creates a new one if it doesn't exist.
   *
   * @param {UpsertProductOptionDTO} data - The attributes to update or create for the option.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO>} The updated or created option.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertOption (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdOption = await productModule.upsertOptions(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the option or return it
   * }
   */
  upsertOptions(
    data: UpsertProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  /**
   * This method is used to update a option.
   *
   * @param {string} id - The ID of the option to be updated.
   * @param {UpdateProductOptionDTO} data - The attributes of the option to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO>} The updated option.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateOption (id: string, title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const option = await productModule.updateOptions(id, {
   *       title
   *     }
   *   )
   *
   *   // do something with the option or return it
   * }
   */
  updateOptions(
    id: string,
    data: UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  /**
   * This method is used to update a list of options determined by the selector filters.
   *
   * @param {FilterableProductOptionProps} selector - The filters that will determine which options will be updated.
   * @param {UpdateProductOptionDTO} data - The attributes to be updated on the selected options
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO[]>} The updated options.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateOptions(ids: string[], title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const options = await productModule.updateOptions({id: ids}, {
   *       title
   *     }
   *   )
   *
   *   // do something with the options or return them
   * }
   */
  updateOptions(
    selector: FilterableProductOptionProps,
    data: UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductOptionDTO[]>

  /**
   * This method is used to delete a product option.
   *
   * @param {string[]} productOptionIds - The IDs of the product options to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the product options are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProductOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteOptions(ids)
   * }
   */
  deleteOptions(
    productOptionIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method is used to delete options. Unlike the {@link delete} method, this method won't completely remove the option. It can still be accessed or retrieved using methods like {@link retrieve} if you pass the `withDeleted` property to the `config` object parameter.
   *
   * The soft-deleted options can be restored using the {@link restore} method.
   *
   * @param {string[]} optionIds - The IDs of the options to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to soft delete along with the each of the options. You can pass to its `returnLinkableKeys`
   * property any of the option's relation attribute names, such as `option_value_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were also soft deleted. The object's keys are the ID attribute names of the option entity's relations, and its value is an array of strings, each being the ID of a record associated with the option through this relation.
   *
   * If there are no related records, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.softDeleteOptions(ids)
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  softDeleteOptions<TReturnableLinkableKeys extends string = string>(
    optionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore options which were deleted using the {@link softDelete} method.
   *
   * @param {string[]} optionIds - The IDs of the options to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to restore along with each of the options. You can pass to its `returnLinkableKeys`
   * property any of the option's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were restored. The object's keys are the ID attribute names of the option entity's relations, and its value is an array of strings, each being the ID of the record associated with the option through this relation.
   *
   * If there are no related records that were restored, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function restoreOptions (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.restoreOptions(ids, {
   *     returnLinkableKeys: ["option_value_id"]
   *   })
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  restoreOptions<TReturnableLinkableKeys extends string = string>(
    optionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a product variant by its ID.
   *
   * @param {string} productVariantId - The ID of the product variant to retrieve.
   * @param {FindConfig<ProductVariantDTO>} config -
   * The configurations determining how the product variant is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product variant.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO>} The retrieved product variant.
   *
   * @example
   * A simple example that retrieves a product variant by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariant (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variant = await productModule.retrieveVariant(id)
   *
   *   // do something with the product variant or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariant (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variant = await productModule.retrieveVariant(id, {
   *     relations: ["options"]
   *   })
   *
   *   // do something with the product variant or return it
   * }
   * ```
   */
  retrieveVariant(
    productVariantId: string,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  /**
   * This method is used to retrieve a paginated list of product variants based on optional filters and configuration.
   *
   * @param {FilterableProductVariantProps} filters - The filters applied on the retrieved product variants.
   * @param {FindConfig<ProductVariantDTO>} config -
   * The configurations determining how the product variants are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product variant.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO[]>} The list of product variants.
   *
   * @example
   * To retrieve a list of product variants using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.listVariants({
   *     id: ids
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product variants:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.listVariants({
   *     id: ids
   *   }, {
   *     relations: ["options"]
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.listVariants({
   *     id: ids
   *   }, {
   *     relations: ["options"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[], sku: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.listVariants({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         sku
   *       }
   *     ]
   *   }, {
   *     relations: ["options"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   */
  listVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  /**
   * This method is used to retrieve a paginated list of product variants along with the total count of available product variants satisfying the provided filters.
   *
   * @param {FilterableProductVariantProps} filters - The filters applied on the retrieved product variants.
   * @param {FindConfig<ProductVariantDTO>} config -
   * The configurations determining how the product variants are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product variant.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductVariantDTO[], number]>} The list of product variants along with their total count.
   *
   * @example
   * To retrieve a list of product variants using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [variants, count] = await productModule.listAndCountVariants({
   *     id: ids
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product variants:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [variants, count] = await productModule.listAndCountVariants({
   *     id: ids
   *   }, {
   *     relations: ["options"]
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [variants, count] = await productModule.listAndCountVariants({
   *     id: ids
   *   }, {
   *     relations: ["options"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveProductVariants (ids: string[], sku: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [variants, count] = await productModule.listAndCountVariants({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         sku
   *       }
   *     ]
   *   }, {
   *     relations: ["options"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product variants or return them
   * }
   * ```
   */
  listAndCountVariants(
    filters?: FilterableProductVariantProps,
    config?: FindConfig<ProductVariantDTO>,
    sharedContext?: Context
  ): Promise<[ProductVariantDTO[], number]>

  /**
   * This method is used to create product variants.
   *
   * @param {CreateProductVariantDTO[]} data - The product variants to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO[]>} The list of created product variants.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createVariants (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.createVariants([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the product variants or return them
   * }
   *
   */
  createVariants(
    data: CreateProductVariantDTO[],
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  /**
   * This method is used to create a product variant.
   *
   * @param {CreateProductVariantDTO} data - The product variant to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO>} The created product variant.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createVariant (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variant = await productModule.createVariants(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the product variant or return them
   * }
   *
   */
  createVariants(
    data: CreateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  /**
   * This method updates existing variants, or creates new ones if they don't exist.
   *
   * @param {UpsertProductVariantDTO[]} data - The attributes to update or create for each variant.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO[]>} The updated and created variants.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertVariants (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdVariants = await productModule.upsertVariants([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the variants or return them
   * }
   */
  upsertVariants(
    data: UpsertProductVariantDTO[],
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  /**
   * This method updates an existing variant, or creates a new one if it doesn't exist.
   *
   * @param {UpsertProductVariantDTO} data - The attributes to update or create for the variant.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO>} The updated or created variant.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertVariant (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdVariant = await productModule.upsertVariants(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the variant or return it
   * }
   */
  upsertVariants(
    data: UpsertProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  /**
   * This method is used to update a variant.
   *
   * @param {string} id - The ID of the variant to be updated.
   * @param {UpdateProductVariantDTO} data - The attributes of the variant to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO>} The updated variant.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateVariant (id: string, title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variant = await productModule.updateVariants(id, {
   *       title
   *     }
   *   )
   *
   *   // do something with the variant or return it
   * }
   */
  updateVariants(
    id: string,
    data: UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  /**
   * This method is used to update a list of variants determined by the selector filters.
   *
   * @param {FilterableProductVariantProps} selector - The filters that will determine which variants will be updated.
   * @param {UpdateProductVariantDTO} data - The attributes to be updated on the selected variants
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO[]>} The updated variants.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateVariants(ids: string[], title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const variants = await productModule.updateVariants({id: ids}, {
   *       title
   *     }
   *   )
   *
   *   // do something with the variants or return them
   * }
   */
  updateVariants(
    selector: FilterableProductVariantProps,
    data: UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductVariantDTO[]>

  /**
   * This method is used to delete ProductVariant. This method will completely remove the ProductVariant and they can no longer be accessed or retrieved.
   *
   * @param {string[]} productVariantIds - The IDs of the ProductVariant to be deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the ProductVariant are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProducts (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteVariants(ids)
   * }
   */
  deleteVariants(
    productVariantIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method is used to delete variants. Unlike the {@link delete} method, this method won't completely remove the variant. It can still be accessed or retrieved using methods like {@link retrieve} if you pass the `withDeleted` property to the `config` object parameter.
   *
   * The soft-deleted variants can be restored using the {@link restore} method.
   *
   * @param {string[]} variantIds - The IDs of the variants to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to soft delete along with the each of the variants. You can pass to its `returnLinkableKeys`
   * property any of the variant's relation attribute names, such as `option_value_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were also soft deleted. The object's keys are the ID attribute names of the variant entity's relations, and its value is an array of strings, each being the ID of a record associated with the variant through this relation.
   *
   * If there are no related records, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteProductVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.softDeleteVariants(ids)
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  softDeleteVariants<TReturnableLinkableKeys extends string = string>(
    variantIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore variants which were deleted using the {@link softDelete} method.
   *
   * @param {string[]} variantIds - The IDs of the variants to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to restore along with each of the variants. You can pass to its `returnLinkableKeys`
   * property any of the variant's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were restored. The object's keys are the ID attribute names of the variant entity's relations, and its value is an array of strings, each being the ID of the record associated with the variant through this relation.
   *
   * If there are no related records that were restored, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function restoreVariants (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.restoreVariants(ids, {
   *     returnLinkableKeys: ["option_value_id"]
   *   })
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  restoreVariants<TReturnableLinkableKeys extends string = string>(
    variantIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a product collection by its ID.
   *
   * @param {string} productCollectionId - The ID of the product collection to retrieve.
   * @param {FindConfig<ProductCollectionDTO>} config -
   * The configurations determining how the product collection is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO>} The retrieved product collection.
   *
   * @example
   * A simple example that retrieves a product collection by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollection (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collection = await productModule.retrieveCollection(id)
   *
   *   // do something with the product collection or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollection (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collection = await productModule.retrieveCollection(id, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product collection or return it
   * }
   * ```
   */
  retrieveCollection(
    productCollectionId: string,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  /**
   * This method is used to retrieve a paginated list of product collections based on optional filters and configuration.
   *
   * @param {FilterableProductCollectionProps} filters - The filters applied on the retrieved product collections.
   * @param {FindConfig<ProductCollectionDTO>} config -
   * The configurations determining how the product collections are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO[]>} The list of product collections.
   *
   * @example
   * To retrieve a list of product collections using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.listCollections({
   *     id: ids
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product collections:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.listCollections({
   *     id: ids
   *   }, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.listCollections({
   *     id: ids
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.listCollections({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title
   *       }
   *     ]
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   */
  listCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  /**
   * This method is used to retrieve a paginated list of product collections along with the total count of available product collections satisfying the provided filters.
   *
   * @param {FilterableProductCollectionProps} filters - The filters applied on the retrieved product collections.
   * @param {FindConfig<ProductCollectionDTO>} config -
   * The configurations determining how the product collections are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductCollectionDTO[], number]>} The list of product collections along with the total count.
   *
   * @example
   * To retrieve a list of product collections using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [collections, count] = await productModule.listAndCountCollections({
   *     id: ids
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product collections:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [collections, count] = await productModule.listAndCountCollections({
   *     id: ids
   *   }, {
   *     relations: ["products"]
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [collections, count] = await productModule.listAndCountCollections({
   *     id: ids
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCollections (ids: string[], title: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [collections, count] = await productModule.listAndCountCollections({
   *     $and: [
   *       {
   *         id: ids
   *       },
   *       {
   *         title
   *       }
   *     ]
   *   }, {
   *     relations: ["products"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product collections or return them
   * }
   * ```
   */
  listAndCountCollections(
    filters?: FilterableProductCollectionProps,
    config?: FindConfig<ProductCollectionDTO>,
    sharedContext?: Context
  ): Promise<[ProductCollectionDTO[], number]>

  /**
   * This method is used to create product collections.
   *
   * @param {CreateProductCollectionDTO[]} data - The product collections to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO[]>} The list of created product collections.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createCollections (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.createCollections([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the product collections or return them
   * }
   *
   */
  createCollections(
    data: CreateProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  /**
   * This method is used to create a product collection.
   *
   * @param {CreateProductCollectionDTO} data - The product collection to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO>} The created product collection.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createCollection (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collection = await productModule.createCollections(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the product collection or return them
   * }
   *
   */
  createCollections(
    data: CreateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  /**
   * This method updates existing collections, or creates new ones if they don't exist.
   *
   * @param {UpsertProductCollectionDTO[]} data - The attributes to update or create for each collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO[]>} The updated and created collections.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertCollections (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdCollections = await productModule.upsertCollections([
   *     {
   *       title
   *     }
   *   ])
   *
   *   // do something with the collections or return them
   * }
   */
  upsertCollections(
    data: UpsertProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  /**
   * This method updates an existing collection, or creates a new one if it doesn't exist.
   *
   * @param {UpsertProductCollectionDTO} data - The attributes to update or create for the collection.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO>} The updated or created collection.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function upsertCollection (title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const createdCollection = await productModule.upsertCollection(
   *     {
   *       title
   *     }
   *   )
   *
   *   // do something with the collection or return it
   * }
   */
  upsertCollections(
    data: UpsertProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  /**
   * This method is used to update a collection.
   *
   * @param {string} id - The ID of the collection to be updated.
   * @param {UpdateProductCollectionDTO} data - The attributes of the collection to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO>} The updated collection.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateCollection (id: string, title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collection = await productModule.updateCollections(id, {
   *       title
   *     }
   *   )
   *
   *   // do something with the collection or return it
   * }
   */
  updateCollections(
    id: string,
    data: UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  /**
   * This method is used to update a list of collections determined by the selector filters.
   *
   * @param {FilterableProductCollectionProps} selector - The filters that will determine which collections will be updated.
   * @param {UpdateProductCollectionDTO} data - The attributes to be updated on the selected collections
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO[]>} The updated collections.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateCollections(ids: string[], title: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const collections = await productModule.updateCollections({id: ids}, {
   *       title
   *     }
   *   )
   *
   *   // do something with the collections or return them
   * }
   */
  updateCollections(
    selector: FilterableProductCollectionProps,
    data: UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO[]>

  /**
   * This method is used to delete collections by their ID.
   *
   * @param {string[]} productCollectionIds - The IDs of the product collections to be updated.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the product options are successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteCollection (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteCollections(ids)
   * }
   *
   */
  deleteCollections(
    productCollectionIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method is used to delete product collections. Unlike the {@link deleteCollections} method, this method won't completely remove the collection. It can still be accessed or retrieved using methods like {@link retrieveCollections} if you pass the `withDeleted` property to the `config` object parameter.
   *
   * The soft-deleted collections can be restored using the {@link restoreCollections} method.
   *
   * @param {string[]} collectionIds - The IDs of the collections to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to soft delete along with the each of the collections. You can pass to its `returnLinkableKeys`
   * property any of the collection's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were also soft deleted. The object's keys are the ID attribute names of the collection entity's relations.
   *
   * If there are no related records, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.softDeleteCollections(ids)
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  softDeleteCollections<TReturnableLinkableKeys extends string = string>(
    collectionIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore collections which were deleted using the {@link softDelete} method.
   *
   * @param {string[]} collectionIds - The IDs of the collections to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to restore along with each of the collections. You can pass to its `returnLinkableKeys`
   * property any of the collection's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were restored. The object's keys are the ID attribute names of the product entity's relations.
   *
   * If there are no related records that were restored, the promise resolved to `void`.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function restoreCollections (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const cascadedEntities = await productModule.restoreCollections(ids, {
   *     returnLinkableKeys: []
   *   })
   *
   *   // do something with the returned cascaded entity IDs or return them
   * }
   */
  restoreCollections<TReturnableLinkableKeys extends string = string>(
    collectionIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to retrieve a product category by its ID.
   *
   * @param {string} productCategoryId - The ID of the product category to retrieve.
   * @param {FindConfig<ProductCategoryDTO>} config -
   * The configurations determining how the product category is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product category.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCategoryDTO>} The retrieved product category.
   *
   * @example
   * A simple example that retrieves a product category by its ID:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategory (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const category = await productModule.retrieveCategory(id)
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategory (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const category = await productModule.retrieveCategory(id, {
   *     relations: ["parent_category"]
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   */
  retrieveCategory(
    productCategoryId: string,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  /**
   * This method is used to retrieve a paginated list of product categories based on optional filters and configuration.
   *
   * @param {FilterableProductCategoryProps} filters - The filters to be applied on the retrieved product categories.
   * @param {FindConfig<ProductCategoryDTO>} config -
   * The configurations determining how the product categories are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product category.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCategoryDTO[]>} The list of product categories.
   *
   * @example
   * To retrieve a list of product categories using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const categories = await productModule.listCategories({
   *     id: ids
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product categories:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const categories = await productModule.listCategories({
   *     id: ids
   *   }, {
   *     relations: ["parent_category"]
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const categories = await productModule.listCategories({
   *     id: ids
   *   }, {
   *     relations: ["parent_category"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[], name: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const categories = await productModule.listCategories({
   *     $or: [
   *       {
   *         id: ids
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     relations: ["parent_category"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   */
  listCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO[]>

  /**
   * This method is used to retrieve a paginated list of product categories along with the total count of available product categories satisfying the provided filters.
   *
   * @param {FilterableProductCategoryProps} filters - The filters to apply on the retrieved product categories.
   * @param {FindConfig<ProductCategoryDTO>} config -
   * The configurations determining how the product categories are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a product category.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[ProductCategoryDTO[], number]>} The list of product categories along with their total count.
   *
   * @example
   * To retrieve a list of product categories using their IDs:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [categories, count] = await productModule.listAndCountCategories({
   *     id: ids
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * To specify relations that should be retrieved within the product categories:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[]) {
   *   const productModule = await initializeProductModule()
   *
   *   const [categories, count] = await productModule.listAndCountCategories({
   *     id: ids
   *   }, {
   *     relations: ["parent_category"]
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[], skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [categories, count] = await productModule.listAndCountCategories({
   *     id: ids
   *   }, {
   *     relations: ["parent_category"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   *
   * You can also use the `$and` or `$or` properties of the `filter` parameter to use and/or conditions in your filters. For example:
   *
   * ```ts
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function retrieveCategories (ids: string[], name: string, skip: number, take: number) {
   *   const productModule = await initializeProductModule()
   *
   *   const [categories, count] = await productModule.listAndCountCategories({
   *     $or: [
   *       {
   *         id: ids
   *       },
   *       {
   *         name
   *       }
   *     ]
   *   }, {
   *     relations: ["parent_category"],
   *     skip,
   *     take
   *   })
   *
   *   // do something with the product category or return it
   * }
   * ```
   */
  listAndCountCategories(
    filters?: FilterableProductCategoryProps,
    config?: FindConfig<ProductCategoryDTO>,
    sharedContext?: Context
  ): Promise<[ProductCategoryDTO[], number]>

  /**
   * This method is used to create a product category.
   *
   * @param {CreateProductCategoryDTO} data - The product category to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCategoryDTO>} The created product category.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function createCategory (name: string, parent_category_id: string | null) {
   *   const productModule = await initializeProductModule()
   *
   *   const category = await productModule.createCategory({
   *     name,
   *     parent_category_id
   *   })
   *
   *   // do something with the product category or return it
   * }
   *
   */
  createCategory(
    data: CreateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  /**
   * This method is used to update a product category by its ID.
   *
   * @param {string} categoryId - The ID of the product category to update.
   * @param {UpdateProductCategoryDTO} data - The attributes to update in th product category.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCategoryDTO>} The updated product category.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function updateCategory (id: string, name: string) {
   *   const productModule = await initializeProductModule()
   *
   *   const category = await productModule.updateCategory(id, {
   *     name,
   *   })
   *
   *   // do something with the product category or return it
   * }
   */
  updateCategory(
    categoryId: string,
    data: UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductCategoryDTO>

  /**
   * This method is used to delete a product category by its ID.
   *
   * @param {string} categoryId - The ID of the product category to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the product category is successfully deleted.
   *
   * @example
   * import {
   *   initialize as initializeProductModule,
   * } from "@medusajs/product"
   *
   * async function deleteCategory (id: string) {
   *   const productModule = await initializeProductModule()
   *
   *   await productModule.deleteCategory(id)
   * }
   */
  deleteCategory(categoryId: string, sharedContext?: Context): Promise<void>
}
