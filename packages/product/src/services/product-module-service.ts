import {
  Context,
  CreateProductOnlyDTO,
  DAL,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ProductTypes,
} from "@medusajs/types"
import {
  Image,
  Product,
  ProductCategory,
  ProductCollection,
  ProductOption,
  ProductOptionValue,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import {
  ProductCategoryService,
  ProductCollectionService,
  ProductOptionService,
  ProductService,
  ProductTagService,
  ProductTypeService,
  ProductVariantService,
} from "@services"

import {
  arrayDifference,
  groupBy,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isString,
  kebabCase,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"
import {
  ProductCategoryServiceTypes,
  ProductCollectionServiceTypes,
  ProductOptionValueServiceTypes,
  ProductServiceTypes,
  ProductVariantServiceTypes,
} from "@types"
import {
  ProductEventData,
  ProductEvents,
  UpdateProductInput,
} from "../types/services/product"
import {
  ProductCategoryEventData,
  ProductCategoryEvents,
} from "../types/services/product-category"
import { entityNameToLinkableKeysMap, joinerConfig } from "./../joiner-config"
import { UpdateCollectionInput } from "src/types/services/product-collection"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService<any>
  productVariantService: ProductVariantService<any, any>
  productTagService: ProductTagService<any>
  productCategoryService: ProductCategoryService<any>
  productCollectionService: ProductCollectionService<any>
  productImageService: ModulesSdkTypes.InternalModuleService<any>
  productTypeService: ProductTypeService<any>
  productOptionService: ProductOptionService<any>
  productOptionValueService: ModulesSdkTypes.InternalModuleService<any>
  eventBusModuleService?: IEventBusModuleService
}

const generateMethodForModels = [
  { model: ProductCategory, singular: "Category", plural: "Categories" },
  { model: ProductCollection, singular: "Collection", plural: "Collections" },
  { model: ProductOption, singular: "Option", plural: "Options" },
  { model: ProductTag, singular: "Tag", plural: "Tags" },
  { model: ProductType, singular: "Type", plural: "Types" },
  { model: ProductVariant, singular: "Variant", plural: "Variants" },
]

export default class ProductModuleService<
    TProduct extends Product = Product,
    TProductVariant extends ProductVariant = ProductVariant,
    TProductTag extends ProductTag = ProductTag,
    TProductCollection extends ProductCollection = ProductCollection,
    TProductCategory extends ProductCategory = ProductCategory,
    TProductImage extends Image = Image,
    TProductType extends ProductType = ProductType,
    TProductOption extends ProductOption = ProductOption,
    TProductOptionValue extends ProductOptionValue = ProductOptionValue
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    ProductTypes.ProductDTO,
    {
      ProductCategory: {
        dto: ProductTypes.ProductCategoryDTO
        singular: "Category"
        plural: "Categories"
      }
      ProductCollection: {
        dto: ProductTypes.ProductCollectionDTO
        singular: "Collection"
        plural: "Collections"
      }
      ProductOption: {
        dto: ProductTypes.ProductOptionDTO
        singular: "Option"
        plural: "Options"
      }
      ProductTag: {
        dto: ProductTypes.ProductTagDTO
        singular: "Tag"
        plural: "Tags"
      }
      ProductType: {
        dto: ProductTypes.ProductTypeDTO
        singular: "Type"
        plural: "Types"
      }
      ProductVariant: {
        dto: ProductTypes.ProductVariantDTO
        singular: "Variant"
        plural: "Variants"
      }
    }
  >(Product, generateMethodForModels, entityNameToLinkableKeysMap)
  implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService_: ProductVariantService<
    TProductVariant,
    TProduct
  >

  // eslint-disable-next-line max-len
  protected readonly productCategoryService_: ProductCategoryService<TProductCategory>
  protected readonly productTagService_: ProductTagService<TProductTag>
  // eslint-disable-next-line max-len
  protected readonly productCollectionService_: ProductCollectionService<TProductCollection>
  // eslint-disable-next-line max-len
  protected readonly productImageService_: ModulesSdkTypes.InternalModuleService<TProductImage>
  protected readonly productTypeService_: ProductTypeService<TProductType>
  protected readonly productOptionService_: ProductOptionService<TProductOption>
  // eslint-disable-next-line max-len
  protected readonly productOptionValueService_: ModulesSdkTypes.InternalModuleService<TProductOptionValue>
  protected readonly eventBusModuleService_?: IEventBusModuleService

  constructor(
    {
      baseRepository,
      productService,
      productVariantService,
      productTagService,
      productCategoryService,
      productCollectionService,
      productImageService,
      productTypeService,
      productOptionService,
      productOptionValueService,
      eventBusModuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.productService_ = productService
    this.productVariantService_ = productVariantService
    this.productTagService_ = productTagService
    this.productCategoryService_ = productCategoryService
    this.productCollectionService_ = productCollectionService
    this.productImageService_ = productImageService
    this.productTypeService_ = productTypeService
    this.productOptionService_ = productOptionService
    this.productOptionValueService_ = productOptionValueService
    this.eventBusModuleService_ = eventBusModuleService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async createVariants(
    data: ProductTypes.CreateProductVariantDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const productOptionIds = data
      .map((pv) => (pv.options || []).map((opt) => opt.option_id!))
      .flat()

    const productOptions = await this.listOptions(
      { id: productOptionIds },
      {
        take: null,
      },
      sharedContext
    )

    const productOptionsMap = new Map<string, ProductTypes.ProductOptionDTO>(
      productOptions.map((po) => [po.id, po])
    )

    const productVariantsMap = new Map<
      string,
      ProductTypes.CreateProductVariantDTO[]
    >()

    for (const productVariantData of data) {
      productVariantData.options = productVariantData.options?.map((option) => {
        const productOption = productOptionsMap.get(option.option_id!)

        return {
          option: productOption?.id,
          value: option.value,
        }
      })

      const productVariants = productVariantsMap.get(
        productVariantData.product_id!
      )

      if (productVariants) {
        productVariants.push(productVariantData)
      } else {
        productVariantsMap.set(productVariantData.product_id!, [
          productVariantData,
        ])
      }
    }

    const productVariants = (
      await promiseAll(
        [...productVariantsMap].map(async ([productId, variants]) => {
          return await this.productVariantService_.create(
            productId,
            variants as unknown as ProductTypes.CreateProductVariantOnlyDTO[],
            sharedContext
          )
        })
      )
    ).flat()

    return await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(productVariants)
  }

  @InjectManager("baseRepository_")
  async updateVariants(
    data: ProductTypes.UpdateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const productVariants = await this.updateVariants_(data, sharedContext)

    const updatedVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(productVariants)

    return updatedVariants
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateVariants_(
    data: ProductTypes.UpdateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProductVariant[]> {
    const variantIdsToUpdate = data.map(({ id }) => id)
    const variants = await this.listVariants(
      { id: variantIdsToUpdate },
      { relations: ["options", "options.option"], take: null },
      sharedContext
    )
    const variantsMap = new Map(
      variants.map((variant) => [variant.id, variant])
    )

    if (variants.length !== data.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot update non-existing variants with ids: ${arrayDifference(
          variantIdsToUpdate,
          [...variantsMap.keys()]
        ).join(", ")}`
      )
    }

    const optionValuesToUpsert: (
      | ProductOptionValueServiceTypes.CreateProductOptionValueDTO
      | ProductOptionValueServiceTypes.UpdateProductOptionValueDTO
    )[] = []
    const optionsValuesToDelete: string[] = []

    const toUpdate = data.map(({ id, options, ...rest }) => {
      const variant = variantsMap.get(id)!

      const toUpdate: ProductVariantServiceTypes.UpdateProductVariantDTO = {
        id,
        product_id: variant.product_id,
      }

      if (options?.length) {
        const optionIdToUpdateValueMap = new Map(
          options.map(({ option, option_id, value }) => {
            const computedOptionId = option_id ?? option.id ?? option
            return [computedOptionId, value]
          })
        )

        for (const existingOptionValue of variant.options) {
          if (!optionIdToUpdateValueMap.has(existingOptionValue.option.id)) {
            optionsValuesToDelete.push(existingOptionValue.id)

            continue
          }

          optionValuesToUpsert.push({
            id: existingOptionValue.id,
            option_id: existingOptionValue.option.id,
            value: optionIdToUpdateValueMap.get(existingOptionValue.option.id)!,
          })
          optionIdToUpdateValueMap.delete(existingOptionValue.option.id)
        }

        for (const [option_id, value] of optionIdToUpdateValueMap.entries()) {
          optionValuesToUpsert.push({
            option_id,
            value,
            variant_id: id,
          })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        if (variant[key] !== value) {
          toUpdate[key] = value
        }
      }

      return toUpdate
    })

    const groups = groupBy(toUpdate, "product_id")

    const [, , productVariants] = await promiseAll([
      await this.productOptionValueService_.delete(
        optionsValuesToDelete,
        sharedContext
      ),
      await this.productOptionValueService_.upsert(
        optionValuesToUpsert,
        sharedContext
      ),
      await promiseAll(
        [...groups.entries()].map(async ([product_id, update]) => {
          return await this.productVariantService_.update(
            product_id,
            update.map(({ product_id, ...update }) => update),
            sharedContext
          )
        })
      ),
    ])

    return productVariants.flat()
  }

  @InjectTransactionManager("baseRepository_")
  async createTags(
    data: ProductTypes.CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const productTags = await this.productTagService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize(productTags, { populate: "*" })
  }

  @InjectTransactionManager("baseRepository_")
  async updateTags(
    data: ProductTypes.UpdateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const productTags = await this.productTagService_.update(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize(productTags, { populate: "*" })
  }

  @InjectTransactionManager("baseRepository_")
  async createTypes(
    data: ProductTypes.CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[]> {
    const productTypes = await this.productTypeService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize(productTypes, {
      populate: "*",
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateTypes(
    data: ProductTypes.UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[]> {
    const productTypes = await this.productTypeService_.update(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize(productTypes, {
      populate: "*",
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createOptions(
    data: ProductTypes.CreateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productOptions = await this.productOptionService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(productOptions)
  }

  @InjectTransactionManager("baseRepository_")
  async updateOptions(
    data: ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productOptions = await this.productOptionService_.update(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(productOptions)
  }

  createCollections(
    data: ProductTypes.CreateProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>
  createCollections(
    data: ProductTypes.CreateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>

  @InjectManager("baseRepository_")
  async createCollections(
    data:
      | ProductTypes.CreateProductCollectionDTO[]
      | ProductTypes.CreateProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
  > {
    const input = Array.isArray(data) ? data : [data]

    const collections = await this.createCollections_(input, sharedContext)

    const createdCollections = await this.baseRepository_.serialize<
      ProductTypes.ProductCollectionDTO[]
    >(collections, { populate: "*" })

    await this.eventBusModuleService_?.emit<ProductCollectionServiceTypes.ProductCollectionEventData>(
      collections.map(({ id }) => ({
        eventName:
          ProductCollectionServiceTypes.ProductCollectionEvents
            .COLLECTION_CREATED,
        data: { id },
      }))
    )

    return Array.isArray(data) ? createdCollections : createdCollections[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createCollections_(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProductCollection[]> {
    return await this.productCollectionService_.create(data, sharedContext)
  }

  async upsertCollections(
    data: ProductTypes.UpsertProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>
  async upsertCollections(
    data: ProductTypes.UpsertProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>
  @InjectTransactionManager("baseRepository_")
  async upsertCollections(
    data:
      | ProductTypes.UpsertProductCollectionDTO[]
      | ProductTypes.UpsertProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (collection): collection is UpdateCollectionInput => !!collection.id
    )
    const forCreate = input.filter(
      (collection): collection is ProductTypes.CreateProductCollectionDTO =>
        !collection.id
    )

    let created: ProductCollection[] = []
    let updated: ProductCollection[] = []

    if (forCreate.length) {
      created = await this.createCollections_(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.updateCollections_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allCollections = await this.baseRepository_.serialize<
      ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
    >(Array.isArray(data) ? result : result[0])

    if (created.length) {
      await this.eventBusModuleService_?.emit<ProductCollectionServiceTypes.ProductCollectionEventData>(
        created.map(({ id }) => ({
          eventName:
            ProductCollectionServiceTypes.ProductCollectionEvents
              .COLLECTION_CREATED,
          data: { id },
        }))
      )
    }

    if (updated.length) {
      await this.eventBusModuleService_?.emit<ProductCollectionServiceTypes.ProductCollectionEventData>(
        updated.map(({ id }) => ({
          eventName:
            ProductCollectionServiceTypes.ProductCollectionEvents
              .COLLECTION_UPDATED,
          data: { id },
        }))
      )
    }

    return Array.isArray(data) ? allCollections : allCollections[0]
  }

  updateCollections(
    id: string,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>
  updateCollections(
    selector: ProductTypes.FilterableProductCollectionProps,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>

  @InjectManager("baseRepository_")
  async updateCollections(
    idOrSelector: string | ProductTypes.FilterableProductCollectionProps,
    data: ProductTypes.UpdateProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
  > {
    let normalizedInput: UpdateCollectionInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const collections = await this.productCollectionService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = collections.map((collection) => ({
        id: collection.id,
        ...data,
      }))
    }

    const collections = await this.updateCollections_(
      normalizedInput,
      sharedContext
    )

    const updatedCollections = await this.baseRepository_.serialize<
      ProductTypes.ProductCollectionDTO[]
    >(collections)

    await this.eventBusModuleService_?.emit<ProductCollectionServiceTypes.ProductCollectionEventData>(
      updatedCollections.map(({ id }) => ({
        eventName:
          ProductCollectionServiceTypes.ProductCollectionEvents
            .COLLECTION_UPDATED,
        data: { id },
      }))
    )

    return isString(idOrSelector) ? updatedCollections[0] : updatedCollections
  }

  @InjectTransactionManager("baseRepository_")
  async updateCollections_(
    data: UpdateCollectionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProductCollection[]> {
    return await this.productCollectionService_.update(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async createCategory(
    data: ProductCategoryServiceTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCategoryDTO> {
    const productCategory = await this.productCategoryService_.create(
      data,
      sharedContext
    )

    await this.eventBusModuleService_?.emit<ProductCategoryEventData>(
      ProductCategoryEvents.CATEGORY_CREATED,
      { id: productCategory.id }
    )

    return await this.baseRepository_.serialize(productCategory, {
      populate: "*",
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateCategory(
    categoryId: string,
    data: ProductCategoryServiceTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCategoryDTO> {
    const productCategory = await this.productCategoryService_.update(
      categoryId,
      data,
      sharedContext
    )

    await this.eventBusModuleService_?.emit<ProductCategoryEventData>(
      ProductCategoryEvents.CATEGORY_UPDATED,
      { id: productCategory.id }
    )

    return await this.baseRepository_.serialize(productCategory, {
      populate: "*",
    })
  }

  create(
    data: ProductTypes.CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>
  create(
    data: ProductTypes.CreateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>

  @InjectManager("baseRepository_")
  async create(
    data: ProductTypes.CreateProductDTO[] | ProductTypes.CreateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    const input = Array.isArray(data) ? data : [data]
    const products = await this.create_(input, sharedContext)

    const createdProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products, { populate: "*" })

    await this.eventBusModuleService_?.emit<ProductEventData>(
      createdProducts.map(({ id }) => ({
        eventName: ProductEvents.PRODUCT_CREATED,
        data: { id },
      }))
    )

    return Array.isArray(data) ? createdProducts : createdProducts[0]
  }

  async upsert(
    data: ProductTypes.UpsertProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>
  async upsert(
    data: ProductTypes.UpsertProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>
  @InjectTransactionManager("baseRepository_")
  async upsert(
    data: ProductTypes.UpsertProductDTO[] | ProductTypes.UpsertProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (product): product is UpdateProductInput => !!product.id
    )
    const forCreate = input.filter(
      (product): product is ProductTypes.CreateProductDTO => !product.id
    )

    let created: Product[] = []
    let updated: Product[] = []

    if (forCreate.length) {
      created = await this.create_(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.update_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[] | ProductTypes.ProductDTO
    >(result, { populate: "*" })

    if (created.length) {
      await this.eventBusModuleService_?.emit<ProductEventData>(
        created.map(({ id }) => ({
          eventName: ProductEvents.PRODUCT_CREATED,
          data: { id },
        }))
      )
    }

    if (updated.length) {
      await this.eventBusModuleService_?.emit<ProductEventData>(
        updated.map(({ id }) => ({
          eventName: ProductEvents.PRODUCT_UPDATED,
          data: { id },
        }))
      )
    }

    return Array.isArray(data) ? allProducts : allProducts[0]
  }

  update(
    id: string,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>
  update(
    selector: ProductTypes.FilterableProductProps,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>

  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | ProductTypes.FilterableProductProps,
    data: ProductTypes.UpdateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    let normalizedInput: UpdateProductInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const products = await this.productService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = products.map((product) => ({
        id: product.id,
        ...data,
      }))
    }

    const products = await this.update_(normalizedInput, sharedContext)

    const updatedProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products, { populate: "*" })

    await this.eventBusModuleService_?.emit<ProductEventData>(
      updatedProducts.map(({ id }) => ({
        eventName: ProductEvents.PRODUCT_UPDATED,
        data: { id },
      }))
    )

    return isString(idOrSelector) ? updatedProducts[0] : updatedProducts
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    const productVariantsMap = new Map<
      string,
      ProductTypes.CreateProductVariantDTO[]
    >()
    const productOptionsMap = new Map<
      string,
      ProductTypes.CreateProductOptionDTO[]
    >()

    const productsData = await promiseAll(
      data.map(async (product) => {
        const productData = { ...product }
        if (!productData.handle) {
          productData.handle = kebabCase(product.title)
        }

        const variants = productData.variants
        const options = productData.options
        delete productData.options
        delete productData.variants

        productVariantsMap.set(productData.handle!, variants ?? [])
        productOptionsMap.set(productData.handle!, options ?? [])

        if (productData.is_giftcard) {
          productData.discountable = false
        }

        await this.upsertAndAssignImagesToProductData(
          productData,
          sharedContext
        )
        await this.upsertAndAssignProductTagsToProductData(
          productData,
          sharedContext
        )
        await this.upsertAndAssignProductTypeToProductData(
          productData,
          sharedContext
        )

        return productData as CreateProductOnlyDTO
      })
    )

    const products = await this.productService_.create(
      productsData,
      sharedContext
    )

    const productByHandleMap = new Map<string, TProduct>(
      products.map((product) => [product.handle!, product])
    )

    const productOptionsData = [...productOptionsMap]
      .map(([handle, options]) => {
        return options.map((option) => {
          const productOptionsData: ProductTypes.CreateProductOptionOnlyDTO = {
            ...option,
          }
          const product = productByHandleMap.get(handle)
          const productId = product?.id

          if (productId) {
            productOptionsData.product_id = productId
          } else if (product) {
            productOptionsData.product = product
          }

          return productOptionsData
        })
      })
      .flat()

    const productOptions = await this.productOptionService_.create(
      productOptionsData,
      sharedContext
    )

    for (const variants of productVariantsMap.values()) {
      variants.forEach((variant) => {
        variant.options = variant.options?.map((option, index) => {
          const productOption = productOptions[index]
          return {
            option: productOption,
            value: option.value,
          }
        })
      })
    }

    await promiseAll(
      [...productVariantsMap].map(async ([handle, variants]) => {
        return await this.productVariantService_.create(
          productByHandleMap.get(handle)!,
          variants as unknown as ProductTypes.CreateProductVariantOnlyDTO[],
          sharedContext
        )
      })
    )

    // TODO: An ugly hack to populate the options in the entity map. The options and variants are created independently of the product create request,
    // so they are not populated in the response. Refactor the create method so this is no longer necessary
    await this.productOptionService_.list(
      { id: productOptions.map((po) => po.id) },
      { take: null },
      sharedContext
    )

    return products
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateProductInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    const productIds = data.map((pd) => pd.id)
    const existingProductVariants = await this.productVariantService_.list(
      { product_id: productIds },
      {
        take: null,
      },
      sharedContext
    )

    const existingProductVariantsMap = new Map<string, ProductVariant[]>(
      data.map((productData) => {
        if (productData.variants === undefined) {
          return [productData.id, []]
        }

        const productVariantsForProduct = existingProductVariants.filter(
          (variant) => variant.product_id === productData.id
        )

        return [productData.id, productVariantsForProduct]
      })
    )

    const productVariantsMap = new Map<
      string,
      ProductTypes.UpsertProductVariantDTO[]
    >()

    const productOptionsMap = new Map<string, TProductOption[]>()

    const productsData = await promiseAll(
      data.map(async (product) => {
        const { variants, ...productData } = product

        if (!isDefined(productData.id)) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Cannot update product without id`
          )
        }

        productVariantsMap.set(productData.id, variants ?? [])

        if (productData.is_giftcard) {
          productData.discountable = false
        }

        await this.upsertAndAssignImagesToProductData(
          productData,
          sharedContext
        )
        await this.upsertAndAssignProductTagsToProductData(
          productData,
          sharedContext
        )
        await this.upsertAndAssignProductTypeToProductData(
          productData,
          sharedContext
        )
        await this.upsertAndAssignOptionsToProductData(
          productData,
          sharedContext
        )

        productOptionsMap.set(
          productData.id,
          (productData.options ?? []) as TProductOption[]
        )

        return productData as UpdateProductInput
      })
    )

    const products = await this.productService_.update(
      productsData,
      sharedContext
    )

    const productByIdMap = new Map<string, TProduct>(
      products.map((product) => [product.id, product])
    )

    const productVariantIdsToDelete: string[] = []
    const productVariantsToCreateMap = new Map<
      string,
      ProductTypes.CreateProductVariantDTO[]
    >()

    const productVariantsToUpdateMap = new Map<
      string,
      ProductTypes.UpdateProductVariantDTO[]
    >()

    for (const [productId, variants] of productVariantsMap) {
      const variantsToCreate: ProductTypes.CreateProductVariantDTO[] = []
      const variantsToUpdate: ProductTypes.UpdateProductVariantDTO[] = []
      const existingVariants = existingProductVariantsMap.get(productId)
      const productOptions = productOptionsMap.get(productId)!

      variants.forEach((variant) => {
        const isVariantIdDefined = "id" in variant && isDefined(variant.id)

        if (isVariantIdDefined) {
          variantsToUpdate.push(variant as ProductTypes.UpdateProductVariantDTO)
        } else {
          variantsToCreate.push(variant as ProductTypes.CreateProductVariantDTO)
        }

        const variantOptions = variant.options?.map((option, index) => {
          const productOption = productOptions[index]
          return {
            option: productOption,
            value: option.value,
          }
        })

        if (variantOptions?.length) {
          variant.options = variantOptions
        }
      })

      productVariantsToCreateMap.set(productId, variantsToCreate)
      productVariantsToUpdateMap.set(productId, variantsToUpdate)

      const variantsToUpdateIds = variantsToUpdate.map((v) => v?.id) as string[]
      const existingVariantIds = existingVariants?.map((v) => v.id) || []
      const variantsToUpdateSet = new Set(variantsToUpdateIds)

      productVariantIdsToDelete.push(
        ...new Set(
          existingVariantIds.filter((x) => !variantsToUpdateSet.has(x))
        )
      )
    }

    const promises: Promise<any>[] = []

    productVariantsToCreateMap.forEach((variants, productId) => {
      promises.push(
        this.productVariantService_.create(
          productByIdMap.get(productId)!,
          variants as unknown as ProductTypes.CreateProductVariantOnlyDTO[],
          sharedContext
        )
      )
    })

    productVariantsToUpdateMap.forEach((variants, productId) => {
      const variants_ =
        // eslint-disable-next-line max-len
        variants as unknown as ProductVariantServiceTypes.UpdateProductVariantDTO[]
      promises.push(
        this.productVariantService_.update(
          productByIdMap.get(productId)!,
          variants_,
          sharedContext
        )
      )
    })

    if (productVariantIdsToDelete.length) {
      promises.push(
        this.productVariantService_.softDelete(
          productVariantIdsToDelete,
          sharedContext
        )
      )
    }

    await promiseAll(promises)

    return products
  }

  protected async upsertAndAssignOptionsToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (productData.options?.length) {
      productData.options = await this.productOptionService_.upsert(
        productData.options,
        sharedContext
      )
    }
  }

  protected async upsertAndAssignImagesToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (!productData.thumbnail && productData.images?.length) {
      productData.thumbnail = isString(productData.images[0])
        ? (productData.images[0] as string)
        : (
            productData.images[0] as {
              url: string
            }
          ).url
    }

    if (productData.images?.length) {
      productData.images = await this.productImageService_.upsert(
        productData.images.map((image) => {
          if (isString(image)) {
            return image
          } else {
            return image.url
          }
        }),
        sharedContext
      )
    }
  }

  protected async upsertAndAssignProductTagsToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (productData.tags?.length) {
      productData.tags = await this.productTagService_.upsert(
        productData.tags,
        sharedContext
      )
    }
  }

  protected async upsertAndAssignProductTypeToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (isDefined(productData.type)) {
      const productType = await this.productTypeService_.upsert(
        [productData.type!],
        sharedContext
      )

      productData.type = productType?.[0] as ProductTypes.CreateProductTypeDTO
    }
  }

  @InjectTransactionManager("baseRepository_")
  async deleteCategory(
    categoryId: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCategoryService_.delete(categoryId, sharedContext)

    await this.eventBusModuleService_?.emit<ProductCategoryEventData>(
      ProductCategoryEvents.CATEGORY_DELETED,
      { id: categoryId }
    )
  }
}
