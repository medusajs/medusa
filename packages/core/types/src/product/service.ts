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
  UpsertProductTypeDTO,
  UpsertProductVariantDTO,
} from "./common"

import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"

/**
 * The main service interface for the Product Module.
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
   * const product =
   *   await productModuleService.retrieve("prod_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const product = await productModuleService.retrieve(
   *   "prod_123",
   *   {
   *     relations: ["categories"],
   *   }
   * )
   * ```
   */
  retrieve(
    productId: string,
    config?: FindConfig<ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductDTO>

  /**
   * This method is used to retrieve a paginated list of products based on optional filters and configuration.
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
   * const products = await productModuleService.list({
   *   id: ["prod_123", "prod_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the products:
   *
   * ```ts
   * const products = await productModuleService.list(
   *   {
   *     id: ["prod_123", "prod_321"],
   *   },
   *   {
   *     relations: ["categories"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const products = await productModuleService.list(
   *   {
   *     id: ["prod_123", "prod_321"],
   *   },
   *   {
   *     relations: ["categories"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [products, count] =
   *   await productModuleService.listAndCount({
   *     id: ["prod_123", "prod_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the products:
   *
   * ```ts
   * const [products, count] =
   *   await productModuleService.listAndCount(
   *     {
   *       id: ["prod_123", "prod_321"],
   *     },
   *     {
   *       relations: ["categories"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [products, count] =
   *   await productModuleService.listAndCount(
   *     {
   *       id: ["prod_123", "prod_321"],
   *     },
   *     {
   *       relations: ["categories"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const products = await productModuleService.create([
   *   {
   *     title: "Shirt",
   *   },
   *   {
   *     title: "Pants",
   *     handle: "pants",
   *   },
   * ])
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
   * const product = await productModuleService.create({
   *   title: "Shirt",
   * })
   */
  create(data: CreateProductDTO, sharedContext?: Context): Promise<ProductDTO>

  /**
   * This method updates existing products, or creates new ones if they don't exist.
   *
   * @param {UpsertProductDTO[]} data - The attributes to update or create for each product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The updated and created products.
   *
   * @example
   * const products = await productModuleService.upsert([
   *   {
   *     id: "prod_123",
   *     handle: "pant",
   *   },
   *   {
   *     title: "Shirt",
   *   },
   * ])
   */
  upsert(
    data: UpsertProductDTO[],
    sharedContext?: Context
  ): Promise<ProductDTO[]>

  /**
   * This method updates the product if it exists, or creates a new ones if it doesn't.
   *
   * @param {UpsertProductDTO} data - The attributes to update or create for the new product.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The updated or created product.
   *
   * @example
   * const product = await productModuleService.upsert({
   *   title: "Shirt",
   * })
   */
  upsert(data: UpsertProductDTO, sharedContext?: Context): Promise<ProductDTO>

  /**
   * This method is used to update a product.
   *
   * @param {string} id - The ID of the product to be updated.
   * @param {UpdateProductDTO} data - The attributes of the product to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO>} The updated product.
   *
   * @example
   * const product = await productModuleService.update(
   *   "prod_123",
   *   {
   *     handle: "pant",
   *   }
   * )
   */
  update(
    id: string,
    data: UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductDTO>

  /**
   * This method is used to update a list of products matching the specified filters.
   *
   * @param {FilterableProductProps} selector - The filters specifying which products to update.
   * @param {UpdateProductDTO} data - The attributes to be updated on the selected products
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductDTO[]>} The updated products.
   *
   * @example
   * const products = await productModuleService.update(
   *   {
   *     title: "Pant",
   *   },
   *   {
   *     handle: "pant",
   *   }
   * )
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
   * await productModuleService.delete(["prod_123", "prod_321"])
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
   * await productModuleService.softDelete([
   *   "prod_123",
   *   "prod_321",
   * ])
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
   * await productModuleService.restore(["prod_123", "prod_321"])
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
   * const tag = await productModuleService.retrieveTag("ptag_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const tag = await productModuleService.retrieveTag(
   *   "ptag_123",
   *   {
   *     relations: ["products"],
   *   }
   * )
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
   * const tags = await productModuleService.listTags({
   *   id: ["ptag_123", "ptag_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the product tags:
   *
   * ```ts
   * const tags = await productModuleService.listTags(
   *   {
   *     id: ["ptag_123", "ptag_321"],
   *   },
   *   {
   *     relations: ["products"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const tags = await productModuleService.listTags(
   *   {
   *     id: ["ptag_123", "ptag_321"],
   *   },
   *   {
   *     relations: ["products"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [tags, count] =
   *   await productModuleService.listAndCountTags({
   *     id: ["ptag_123", "ptag_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product tags:
   *
   * ```ts
   * const [tags, count] =
   *   await productModuleService.listAndCountTags(
   *     {
   *       id: ["ptag_123", "ptag_321"],
   *     },
   *     {
   *       relations: ["products"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [tags, count] =
   *   await productModuleService.listAndCountTags(
   *     {
   *       id: ["ptag_123", "ptag_321"],
   *     },
   *     {
   *       relations: ["products"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const tags = await productModuleService.createTags([
   *   {
   *     value: "Clothes",
   *   },
   *   {
   *     value: "Accessories",
   *   },
   * ])
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
   * const productTags = await productModule.updateTags([
   *   {
   *     id,
   *     value
   *   }
   * ])
   *
   * @ignore
   *
   * @privateRemarks
   * This method needs an update as it doesn't allow passing an ID of the tag to update
   * So, for now, we've added the `@\ignore` tag to not show it in the generated docs.
   * Once fixed, the `@\ignore` tag (and this comment) can be removed safely.
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
   * await productModuleService.deleteTags([
   *   "ptag_123",
   *   "ptag_321",
   * ])
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
   * const productType =
   *   await productModuleService.retrieveType("ptyp_123")
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
   * const productTypes = await productModuleService.listTypes({
   *   id: ["ptyp_123", "ptyp_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const productTypes = await productModuleService.listTypes(
   *   {
   *     id: ["ptyp_123", "ptyp_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [productTypes, count] =
   *   await productModuleService.listAndCountTypes({
   *     id: ["ptyp_123", "ptyp_321"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [productTypes, count] =
   *   await productModuleService.listAndCountTypes(
   *     {
   *       id: ["ptyp_123", "ptyp_321"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const productTypes = await productModuleService.createTypes([
   *   {
   *     value: "digital",
   *   },
   * ])
   */
  createTypes(
    data: CreateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  /**
   * This method is used to create a product type.
   *
   * @param {CreateProductTypeDTO} data - The product type to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO>} The created product type.
   *
   * @example
   * const productType = await productModuleService.createTypes({
   *   value: "digital",
   * })
   *
   */
  createTypes(
    data: CreateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypeDTO>

  /**
   * This method updates existing types, or creates new ones if they don't exist.
   *
   * @param {UpsertProductTypeDTO[]} data - The attributes to update or create for each type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO[]>} The updated and created types.
   *
   * @example
   * const productTypes = await productModuleService.upsertTypes([
   *   {
   *     id: "ptyp_123",
   *     metadata: {
   *       test: true,
   *     },
   *   },
   *   {
   *     value: "Digital",
   *   },
   * ])
   */
  upsertTypes(
    data: UpsertProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypeDTO[]>

  /**
   * This method updates an existing type, or creates a new one if it doesn't exist.
   *
   * @param {UpsertProductTypeDTO} data - The attributes to update or create for the type.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO>} The updated or created type.
   *
   * @example
   * const productType = await productModuleService.upsertTypes({
   *   id: "ptyp_123",
   *   metadata: {
   *     test: true,
   *   },
   * })
   */
  upsertTypes(
    data: UpsertProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypeDTO>

  /**
   * This method is used to update a type.
   *
   * @param {string} id - The ID of the type to be updated.
   * @param {UpdateProductTypeDTO} data - The attributes of the type to be updated
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO>} The updated type.
   *
   * @example
   * const productType = await productModuleService.updateTypes(
   *   "ptyp_123",
   *   {
   *     value: "Digital",
   *   }
   * )
   */
  updateTypes(
    id: string,
    data: UpdateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypeDTO>

  /**
   * This method is used to update a list of types matching the specified filters.
   *
   * @param {FilterableProductTypeProps} selector - The filters specifying which types to update.
   * @param {UpdateProductTypeDTO} data - The attributes to be updated on the selected types
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductTypeDTO[]>} The updated types.
   *
   * @example
   * const productTypes = await productModuleService.updateTypes(
   *   {
   *     id: ["ptyp_123", "ptyp_321"],
   *   },
   *   {
   *     value: "Digital",
   *   }
   * )
   */
  updateTypes(
    selector: FilterableProductTypeProps,
    data: UpdateProductTypeDTO,
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
   * await productModuleService.deleteTypes([
   *   "ptyp_123",
   *   "ptyp_321",
   * ])
   */
  deleteTypes(productTypeIds: string[], sharedContext?: Context): Promise<void>

  /**
   * This method is used to delete types. Unlike the {@link delete} method, this method won't completely remove the type. It can still be accessed or retrieved using methods like {@link retrieve} if you pass the `withDeleted` property to the `config` object parameter.
   *
   * The soft-deleted types can be restored using the {@link restore} method.
   *
   * @param {string[]} typeIds - The IDs of the types to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to soft delete along with the each of the types. You can pass to its `returnLinkableKeys`
   * property any of the type's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were also soft deleted. The object's keys are the ID attribute names of the type entity's relations, and its value is an array of strings, each being the ID of a record associated with the type through this relation.
   *
   * If there are no related records, the promise resolved to `void`.
   *
   * @example
   * await productModuleService.softDeleteTypes([
   *   "ptyp_123",
   *   "ptyp_321",
   * ])
   */
  softDeleteTypes<TReturnableLinkableKeys extends string = string>(
    typeIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method is used to restore types which were deleted using the {@link softDelete} method.
   *
   * @param {string[]} typeIds - The IDs of the types to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config -
   * Configurations determining which relations to restore along with each of the types. You can pass to its `returnLinkableKeys`
   * property any of the type's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Record<string, string[]> | void>}
   * An object that includes the IDs of related records that were restored. The object's keys are the ID attribute names of the type entity's relations, and its value is an array of strings, each being the ID of the record associated with the type through this relation.
   *
   * If there are no related records that were restored, the promise resolved to `void`.
   *
   * @example
   * await productModuleService.restoreTypes([
   *   "ptyp_123",
   *   "ptyp_321",
   * ])
   */
  restoreTypes<TReturnableLinkableKeys extends string = string>(
    typeIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

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
   * const option =
   *   await productModuleService.retrieveOption("opt_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const option = await productModuleService.retrieveOption(
   *   "opt_123",
   *   {
   *     relations: ["product"],
   *   }
   * )
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
   * const options = await productModuleService.listOptions({
    id: ["opt_123", "opt_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the product options:
   *
   * ```ts
   * const options = await productModuleService.listOptions(
   *   {
   *     id: ["opt_123", "opt_321"],
   *   },
   *   {
   *     relations: ["product"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const options = await productModuleService.listOptions(
   *   {
   *     id: ["opt_123", "opt_321"],
   *   },
   *   {
   *     relations: ["product"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   *
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
   * const [options, count] =
   *   await productModuleService.listAndCountOptions({
   *     id: ["opt_123", "opt_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product types:
   *
   * ```ts
   * const [options, count] =
   *   await productModuleService.listAndCountOptions(
   *     {
   *       id: ["opt_123", "opt_321"],
   *     },
   *     {
   *       relations: ["product"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [options, count] =
   *   await productModuleService.listAndCountOptions(
   *     {
   *       id: ["opt_123", "opt_321"],
   *     },
   *     {
   *       relations: ["product"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const options = await productModuleService.createOptions([
   *   {
   *     title: "Color",
   *     values: ["Blue", "Green"],
   *     product_id: "prod_123",
   *   },
   *   {
   *     title: "Size",
   *     values: ["Small", "Medium"],
   *     product_id: "prod_321",
   *   },
   * ])
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
   * const option = await productModuleService.createOptions({
   *   title: "Color",
   *   values: ["Blue", "Green"],
   *   product_id: "prod_123",
   * })
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
   * const options = await productModuleService.upsertOptions([
   *   {
   *     id: "opt_123",
   *     title: "Color",
   *   },
   *   {
   *     title: "Color",
   *     values: ["Blue", "Green"],
   *     product_id: "prod_123",
   *   },
   * ])
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
   * const option = await productModuleService.upsertOptions({
   *   id: "opt_123",
   *   title: "Color",
   * })
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
   * const option = await productModuleService.updateOptions(
   *   "opt_123",
   *   {
   *     title: "Color",
   *   }
   * )
   */
  updateOptions(
    id: string,
    data: UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductOptionDTO>

  /**
   * This method is used to update a list of options matching the specified filters.
   *
   * @param {FilterableProductOptionProps} selector - The filters specifying which options to update.
   * @param {UpdateProductOptionDTO} data - The attributes to be updated on the selected options
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductOptionDTO[]>} The updated options.
   *
   * @example
   * const options = await productModuleService.updateOptions(
   *   {
   *     title: "Color",
   *   },
   *   {
   *     values: ["Blue", "Green"],
   *   }
   * )
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
   * await productModuleService.deleteOptions([
   *   "opt_123",
   *   "opt_321",
   * ])
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
   * await productModuleService.softDeleteOptions([
   *   "opt_123",
   *   "opt_321",
   * ])
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
   * await productModuleService.restoreOptions([
   *   "opt_123",
   *   "opt_321",
   * ])
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
   * const variant =
   *   await productModuleService.retrieveVariant("variant_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const variant = await productModuleService.retrieveVariant(
   *   "variant_123",
   *   {
   *     relations: ["options"],
   *   }
   * )
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
   * const variants = await productModuleService.listVariants({
   *   id: ["variant_123", "variant_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the product variants:
   *
   * ```ts
   * const variants = await productModuleService.listVariants(
   *   {
   *     id: ["variant_123", "variant_321"],
   *   },
   *   {
   *     relations: ["options"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const variants = await productModuleService.listVariants(
   *   {
   *     id: ["variant_123", "variant_321"],
   *   },
   *   {
   *     relations: ["options"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [variants, count] =
   *   await productModuleService.listAndCountVariants({
   *     id: ["variant_123", "variant_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product variants:
   *
   * ```ts
   * const [variants, count] =
   *   await productModuleService.listAndCountVariants(
   *     {
   *       id: ["variant_123", "variant_321"],
   *     },
   *     {
   *       relations: ["options"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [variants, count] =
   *   await productModuleService.listAndCountVariants(
   *     {
   *       id: ["variant_123", "variant_321"],
   *     },
   *     {
   *       relations: ["options"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const variants = await productModuleService.createVariants([
   *   {
   *     title: "Blue Shirt",
   *     product_id: "prod_123",
   *     options: {
   *       Color: "Blue",
   *     },
   *   },
   *   {
   *     title: "Green Shirt",
   *     product_id: "prod_321",
   *     options: {
   *       Color: "Green",
   *     },
   *   },
   * ])
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
   * const variant = await productModuleService.createVariants({
   *   title: "Blue Shirt",
   *   product_id: "prod_123",
   *   options: {
   *     Color: "Blue",
   *   },
   * })
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
   * const variants = await productModuleService.upsertVariants([
   *   {
   *     id: "variant_123",
   *     title: "Green Shirt",
   *   },
   *   {
   *     title: "Blue Shirt",
   *     options: {
   *       Color: "Blue",
   *     },
   *   },
   * ])
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
   * const variant = await productModuleService.upsertVariants({
   *   id: "variant_123",
   *   title: "Green Shirt",
   * })
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
   * const variant = await productModuleService.updateVariants(
   *   "variant_123",
   *   {
   *     title: "Blue Shirt",
   *   }
   * )
   */
  updateVariants(
    id: string,
    data: UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductVariantDTO>

  /**
   * This method is used to update a list of variants matching the specified filters.
   *
   * @param {FilterableProductVariantProps} selector - The filters specifying which variants to update.
   * @param {UpdateProductVariantDTO} data - The attributes to be updated on the selected variants
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductVariantDTO[]>} The updated variants.
   *
   * @example
   * const variants = await productModuleService.updateVariants(
   *   {
   *     id: ["variant_123", "variant_321"],
   *   },
   *   {
   *     title: "Blue Shirt",
   *   }
   * )
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
   * await productModuleService.deleteVariants([
   *   "variant_123",
   *   "variant_321",
   * ])
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
   * await productModuleService.softDeleteVariants([
   *   "variant_123",
   *   "variant_321",
   * ])
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
   * await productModuleService.restoreVariants([
   *   "variant_123",
   *   "variant_321",
   * ])
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
   * const collection =
   *   await productModuleService.retrieveCollection("pcol_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const collection =
   *   await productModuleService.retrieveCollection("pcol_123", {
   *     relations: ["products"],
   *   })
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
   * const collections =
   *   await productModuleService.listCollections({
   *     id: ["pcol_123", "pcol_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product collections:
   *
   * ```ts
   * const collections =
   *   await productModuleService.listCollections(
   *     {
   *       id: ["pcol_123", "pcol_321"],
   *     },
   *     {
   *       relations: ["products"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const collections =
   *   await productModuleService.listCollections(
   *     {
   *       id: ["pcol_123", "pcol_321"],
   *     },
   *     {
   *       relations: ["products"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const [collections, count] =
   *   await productModuleService.listAndCountCollections({
   *     id: ["pcol_123", "pcol_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product collections:
   *
   * ```ts
   * const [collections, count] =
   *   await productModuleService.listAndCountCollections(
   *     {
   *       id: ["pcol_123", "pcol_321"],
   *     },
   *     {
   *       relations: ["products"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [collections, count] =
   *   await productModuleService.listAndCountCollections(
   *     {
   *       id: ["pcol_123", "pcol_321"],
   *     },
   *     {
   *       relations: ["products"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const collections =
   *   await productModuleService.createCollections([
   *     {
   *       title: "Summer Collection",
   *     },
   *     {
   *       title: "Winter Collection",
   *     },
   *   ])
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
   * const collection =
   *   await productModuleService.createCollections({
   *     title: "Summer Collection",
   *   })
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
   * const collections =
   *   await productModuleService.upsertCollections([
   *     {
   *       id: "pcol_123",
   *       title: "Winter Collection",
   *     },
   *     {
   *       title: "Summer Collection",
   *     },
   *   ])
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
   * const collection =
   *   await productModuleService.upsertCollections({
   *     id: "pcol_123",
   *     title: "Winter Collection",
   *   })
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
   * const collection =
   *   await productModuleService.updateCollections("pcol_123", {
   *     title: "Summer Collection",
   *   })
   */
  updateCollections(
    id: string,
    data: UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductCollectionDTO>

  /**
   * This method is used to update a list of collections matching the specified filters.
   *
   * @param {FilterableProductCollectionProps} selector - The filters specifying which collections to update.
   * @param {UpdateProductCollectionDTO} data - The attributes to be updated on the selected collections
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProductCollectionDTO[]>} The updated collections.
   *
   * @example
   * const collections =
   *   await productModuleService.updateCollections(
   *     {
   *       id: ["pcol_123", "pcol_321"],
   *     },
   *     {
   *       title: "Summer Collection",
   *     }
   *   )
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
   * await productModuleService.deleteCollections([
   *   "pcol_123",
   *   "pcol_321",
   * ])
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
   * await productModuleService.softDeleteCollections([
   *   "pcol_123",
   *   "pcol_321",
   * ])
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
   * await productModuleService.restoreCollections([
   *   "pcol_123",
   *   "pcol_321",
   * ])
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
   * const category =
   *   await productModuleService.retrieveCategory("pcat_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const category = await productModuleService.retrieveCategory(
   *   "pcat_123",
   *   {
   *     relations: ["products"],
   *   }
   * )
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
   * const categories = await productModuleService.listCategories({
   *   id: ["pcat_123", "pcat_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the product categories:
   *
   * ```ts
   * const categories = await productModuleService.listCategories(
   *   {
   *     id: ["pcat_123", "pcat_321"],
   *   },
   *   {
   *     relations: ["products"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const categories = await productModuleService.listCategories(
   *   {
   *     id: ["pcat_123", "pcat_321"],
   *   },
   *   {
   *     relations: ["products"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
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
   * const [categories, count] =
   *   await productModuleService.listAndCountCategories({
   *     id: ["pcat_123", "pcat_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the product categories:
   *
   * ```ts
   * const [categories, count] =
   *   await productModuleService.listAndCountCategories(
   *     {
   *       id: ["pcat_123", "pcat_321"],
   *     },
   *     {
   *       relations: ["products"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [categories, count] =
   *   await productModuleService.listAndCountCategories(
   *     {
   *       id: ["pcat_123", "pcat_321"],
   *     },
   *     {
   *       relations: ["products"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
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
   * const category = await productModuleService.createCategory({
   *   name: "Shirts",
   *   parent_category_id: null,
   * })
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
   * const category = await productModuleService.updateCategory(
   *   "pcat_123",
   *   {
   *     name: "Shirts",
   *   }
   * )
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
   * await productModuleService.deleteCategory("pcat_123")
   */
  deleteCategory(categoryId: string, sharedContext?: Context): Promise<void>
}
