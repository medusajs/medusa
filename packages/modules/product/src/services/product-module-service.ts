import {
  Context,
  DAL,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ProductTypes,
} from "@medusajs/types"
import {
  Image as ProductImage,
  Product,
  ProductCategory,
  ProductCollection,
  ProductOption,
  ProductOptionValue,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import { ProductCategoryService, ProductService } from "@services"

import {
  arrayDifference,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isPresent,
  isString,
  isValidHandle,
  kebabCase,
  MedusaContext,
  MedusaError,
  MedusaService,
  ProductStatus,
  promiseAll,
  removeUndefined,
  toHandle,
} from "@medusajs/utils"
import {
  ProductCollectionEventData,
  ProductCollectionEvents,
  ProductEventData,
  ProductEvents,
  UpdateCategoryInput,
  UpdateCollectionInput,
  UpdateProductInput,
  UpdateProductOptionInput,
  UpdateProductVariantInput,
  UpdateTagInput,
  UpdateTypeInput,
} from "../types"
import { eventBuilders } from "../utils"
import { joinerConfig } from "./../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService
  productVariantService: ModulesSdkTypes.IMedusaInternalService<any, any>
  productTagService: ModulesSdkTypes.IMedusaInternalService<any>
  productCategoryService: ProductCategoryService
  productCollectionService: ModulesSdkTypes.IMedusaInternalService<any>
  productImageService: ModulesSdkTypes.IMedusaInternalService<any>
  productTypeService: ModulesSdkTypes.IMedusaInternalService<any>
  productOptionService: ModulesSdkTypes.IMedusaInternalService<any>
  productOptionValueService: ModulesSdkTypes.IMedusaInternalService<any>
  eventBusModuleService?: IEventBusModuleService
}

export default class ProductModuleService
  extends MedusaService<{
    Product: {
      dto: ProductTypes.ProductDTO
    }
    ProductCategory: {
      dto: ProductTypes.ProductCategoryDTO
    }
    ProductCollection: {
      dto: ProductTypes.ProductCollectionDTO
    }
    ProductOption: {
      dto: ProductTypes.ProductOptionDTO
    }
    ProductTag: {
      dto: ProductTypes.ProductTagDTO
    }
    ProductType: {
      dto: ProductTypes.ProductTypeDTO
    }
    ProductVariant: {
      dto: ProductTypes.ProductVariantDTO
    }
  }>({
    Product,
    ProductCategory,
    ProductCollection,
    ProductOption,
    ProductTag,
    ProductType,
    ProductVariant,
  })
  implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService
  protected readonly productVariantService_: ModulesSdkTypes.IMedusaInternalService<ProductVariant>
  protected readonly productCategoryService_: ProductCategoryService
  protected readonly productTagService_: ModulesSdkTypes.IMedusaInternalService<ProductTag>
  protected readonly productCollectionService_: ModulesSdkTypes.IMedusaInternalService<ProductCollection>
  protected readonly productImageService_: ModulesSdkTypes.IMedusaInternalService<ProductImage>
  protected readonly productTypeService_: ModulesSdkTypes.IMedusaInternalService<ProductType>
  protected readonly productOptionService_: ModulesSdkTypes.IMedusaInternalService<ProductOption>
  protected readonly productOptionValueService_: ModulesSdkTypes.IMedusaInternalService<ProductOptionValue>
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

  // TODO: Add options validation, among other things
  // @ts-ignore
  createProductVariants(
    data: ProductTypes.CreateProductVariantDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]>
  createProductVariants(
    data: ProductTypes.CreateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createProductVariants(
    data:
      | ProductTypes.CreateProductVariantDTO[]
      | ProductTypes.CreateProductVariantDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductVariantDTO[] | ProductTypes.ProductVariantDTO
  > {
    const input = Array.isArray(data) ? data : [data]

    const variants = await this.createVariants_(input, sharedContext)

    const createdVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(variants)

    return Array.isArray(data) ? createdVariants : createdVariants[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createVariants_(
    data: ProductTypes.CreateProductVariantDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductVariant[]> {
    if (data.some((v) => !v.product_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Unable to create variants without specifying a product_id"
      )
    }

    const productOptions = await this.productOptionService_.list(
      {
        product_id: [...new Set<string>(data.map((v) => v.product_id!))],
      },
      {
        take: null,
        relations: ["values"],
      },
      sharedContext
    )

    const productVariantsWithOptions =
      ProductModuleService.assignOptionsToVariants(data, productOptions)

    const createdVariants = await this.productVariantService_.create(
      productVariantsWithOptions,
      sharedContext
    )

    eventBuilders.createdProductVariant({
      data: createdVariants,
      sharedContext,
    })

    return createdVariants
  }

  async upsertProductVariants(
    data: ProductTypes.UpsertProductVariantDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]>
  async upsertProductVariants(
    data: ProductTypes.UpsertProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO>

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async upsertProductVariants(
    data:
      | ProductTypes.UpsertProductVariantDTO[]
      | ProductTypes.UpsertProductVariantDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductVariantDTO[] | ProductTypes.ProductVariantDTO
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (variant): variant is UpdateProductVariantInput => !!variant.id
    )
    const forCreate = input.filter(
      (variant): variant is ProductTypes.CreateProductVariantDTO => !variant.id
    )

    let created: ProductVariant[] = []
    let updated: ProductVariant[] = []

    if (forCreate.length) {
      created = await this.createVariants_(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.updateVariants_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[] | ProductTypes.ProductVariantDTO
    >(result)

    return Array.isArray(data) ? allVariants : allVariants[0]
  }

  // @ts-ignore
  updateProductVariants(
    id: string,
    data: ProductTypes.UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO>
  updateProductVariants(
    selector: ProductTypes.FilterableProductVariantProps,
    data: ProductTypes.UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateProductVariants(
    idOrSelector: string | ProductTypes.FilterableProductVariantProps,
    data: ProductTypes.UpdateProductVariantDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductVariantDTO[] | ProductTypes.ProductVariantDTO
  > {
    let normalizedInput: UpdateProductVariantInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const variants = await this.productVariantService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = variants.map((variant) => ({
        id: variant.id,
        ...data,
      }))
    }

    const variants = await this.updateVariants_(normalizedInput, sharedContext)

    const updatedVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(variants)

    return isString(idOrSelector) ? updatedVariants[0] : updatedVariants
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateVariants_(
    data: UpdateProductVariantInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductVariant[]> {
    // Validation step
    const variantIdsToUpdate = data.map(({ id }) => id)
    const variants = await this.productVariantService_.list(
      { id: variantIdsToUpdate },
      { take: null },
      sharedContext
    )
    if (variants.length !== data.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot update non-existing variants with ids: ${arrayDifference(
          variantIdsToUpdate,
          variants.map(({ id }) => id)
        ).join(", ")}`
      )
    }

    // Data normalization
    const variantsWithProductId: UpdateProductVariantInput[] = variants.map(
      (v) => ({
        ...data.find((d) => d.id === v.id),
        id: v.id,
        product_id: v.product_id,
      })
    )

    const productOptions = await this.productOptionService_.list(
      {
        product_id: Array.from(
          new Set(variantsWithProductId.map((v) => v.product_id!))
        ),
      },
      { take: null, relations: ["values"] },
      sharedContext
    )

    const { entities: productVariants, performedActions } =
      await this.productVariantService_.upsertWithReplace(
        ProductModuleService.assignOptionsToVariants(
          variantsWithProductId,
          productOptions
        ),
        {
          relations: ["options"],
        },
        sharedContext
      )

    eventBuilders.createdProductVariant({
      data: performedActions.created[ProductVariant.name] ?? [],
      sharedContext,
    })
    eventBuilders.updatedProductVariant({
      data: performedActions.updated[ProductVariant.name] ?? [],
      sharedContext,
    })
    eventBuilders.deletedProductVariant({
      data: performedActions.deleted[ProductVariant.name] ?? [],
      sharedContext,
    })

    return productVariants
  }

  // @ts-ignore
  createProductTags(
    data: ProductTypes.CreateProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]>
  createProductTags(
    data: ProductTypes.CreateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createProductTags(
    data: ProductTypes.CreateProductTagDTO[] | ProductTypes.CreateProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO> {
    const input = Array.isArray(data) ? data : [data]

    const tags = await this.productTagService_.create(input, sharedContext)

    const createdTags = await this.baseRepository_.serialize<
      ProductTypes.ProductTagDTO[]
    >(tags)

    eventBuilders.createdProductTag({
      data: createdTags,
      sharedContext,
    })

    return Array.isArray(data) ? createdTags : createdTags[0]
  }

  async upsertProductTags(
    data: ProductTypes.UpsertProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]>
  async upsertProductTags(
    data: ProductTypes.UpsertProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO>

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async upsertProductTags(
    data: ProductTypes.UpsertProductTagDTO[] | ProductTypes.UpsertProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((tag): tag is UpdateTagInput => !!tag.id)
    const forCreate = input.filter(
      (tag): tag is ProductTypes.CreateProductTagDTO => !tag.id
    )

    let created: ProductTag[] = []
    let updated: ProductTag[] = []

    if (forCreate.length) {
      created = await this.productTagService_.create(forCreate, sharedContext)
      eventBuilders.createdProductTag({
        data: created,
        sharedContext,
      })
    }
    if (forUpdate.length) {
      updated = await this.productTagService_.update(forUpdate, sharedContext)
      eventBuilders.updatedProductTag({
        data: updated,
        sharedContext,
      })
    }

    const result = [...created, ...updated]
    const allTags = await this.baseRepository_.serialize<
      ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO
    >(result)

    return Array.isArray(data) ? allTags : allTags[0]
  }

  // @ts-ignore
  updateProductTags(
    id: string,
    data: ProductTypes.UpdateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO>
  updateProductTags(
    selector: ProductTypes.FilterableProductTagProps,
    data: ProductTypes.UpdateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateProductTags(
    idOrSelector: string | ProductTypes.FilterableProductTagProps,
    data: ProductTypes.UpdateProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO> {
    let normalizedInput: UpdateTagInput[] = []
    if (isString(idOrSelector)) {
      // Check if the tag exists in the first place
      await this.productTagService_.retrieve(idOrSelector, {}, sharedContext)
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const tags = await this.productTagService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = tags.map((tag) => ({
        id: tag.id,
        ...data,
      }))
    }

    const tags = await this.productTagService_.update(
      normalizedInput,
      sharedContext
    )

    const updatedTags = await this.baseRepository_.serialize<
      ProductTypes.ProductTagDTO[]
    >(tags)

    eventBuilders.updatedProductTag({
      data: updatedTags,
      sharedContext,
    })

    return isString(idOrSelector) ? updatedTags[0] : updatedTags
  }

  // @ts-ignore
  createProductTypes(
    data: ProductTypes.CreateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO[]>
  createProductTypes(
    data: ProductTypes.CreateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO>

  @InjectManager("baseRepository_")
  async createProductTypes(
    data:
      | ProductTypes.CreateProductTypeDTO[]
      | ProductTypes.CreateProductTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO> {
    const input = Array.isArray(data) ? data : [data]

    const types = await this.productTypeService_.create(input, sharedContext)

    const createdTypes = await this.baseRepository_.serialize<
      ProductTypes.ProductTypeDTO[]
    >(types)

    return Array.isArray(data) ? createdTypes : createdTypes[0]
  }

  async upsertProductTypes(
    data: ProductTypes.UpsertProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO[]>
  async upsertProductTypes(
    data: ProductTypes.UpsertProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO>

  @InjectTransactionManager("baseRepository_")
  async upsertProductTypes(
    data:
      | ProductTypes.UpsertProductTypeDTO[]
      | ProductTypes.UpsertProductTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((type): type is UpdateTypeInput => !!type.id)
    const forCreate = input.filter(
      (type): type is ProductTypes.CreateProductTypeDTO => !type.id
    )

    let created: ProductType[] = []
    let updated: ProductType[] = []

    if (forCreate.length) {
      created = await this.productTypeService_.create(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.productTypeService_.update(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allTypes = await this.baseRepository_.serialize<
      ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO
    >(result)

    return Array.isArray(data) ? allTypes : allTypes[0]
  }

  // @ts-ignore
  updateProductTypes(
    id: string,
    data: ProductTypes.UpdateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO>
  updateProductTypes(
    selector: ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO[]>

  @InjectManager("baseRepository_")
  async updateProductTypes(
    idOrSelector: string | ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO> {
    let normalizedInput: UpdateTypeInput[] = []
    if (isString(idOrSelector)) {
      // Check if the type exists in the first place
      await this.productTypeService_.retrieve(idOrSelector, {}, sharedContext)
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const types = await this.productTypeService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = types.map((type) => ({
        id: type.id,
        ...data,
      }))
    }

    const types = await this.productTypeService_.update(
      normalizedInput,
      sharedContext
    )

    const updatedTypes = await this.baseRepository_.serialize<
      ProductTypes.ProductTypeDTO[]
    >(types)

    return isString(idOrSelector) ? updatedTypes[0] : updatedTypes
  }

  // @ts-ignore
  createProductOptions(
    data: ProductTypes.CreateProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>
  createProductOptions(
    data: ProductTypes.CreateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>

  @InjectManager("baseRepository_")
  async createProductOptions(
    data:
      | ProductTypes.CreateProductOptionDTO[]
      | ProductTypes.CreateProductOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO[] | ProductTypes.ProductOptionDTO> {
    const input = Array.isArray(data) ? data : [data]

    const options = await this.createOptions_(input, sharedContext)

    const createdOptions = await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(options)

    return Array.isArray(data) ? createdOptions : createdOptions[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createOptions_(
    data: ProductTypes.CreateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductOption[]> {
    if (data.some((v) => !v.product_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Tried to create options without specifying a product_id"
      )
    }

    const normalizedInput = data.map((opt) => {
      return {
        ...opt,
        values: opt.values?.map((v) => {
          return typeof v === "string" ? { value: v } : v
        }),
      }
    })

    return await this.productOptionService_.create(
      normalizedInput,
      sharedContext
    )
  }

  async upsertProductOptions(
    data: ProductTypes.UpsertProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>
  async upsertProductOptions(
    data: ProductTypes.UpsertProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>

  @InjectTransactionManager("baseRepository_")
  async upsertProductOptions(
    data:
      | ProductTypes.UpsertProductOptionDTO[]
      | ProductTypes.UpsertProductOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO[] | ProductTypes.ProductOptionDTO> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (option): option is UpdateProductOptionInput => !!option.id
    )
    const forCreate = input.filter(
      (option): option is ProductTypes.CreateProductOptionDTO => !option.id
    )

    let created: ProductOption[] = []
    let updated: ProductOption[] = []

    if (forCreate.length) {
      created = await this.createOptions_(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.updateOptions_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allOptions = await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[] | ProductTypes.ProductOptionDTO
    >(result)

    return Array.isArray(data) ? allOptions : allOptions[0]
  }

  // @ts-ignore
  updateProductOptions(
    id: string,
    data: ProductTypes.UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>
  updateProductOptions(
    selector: ProductTypes.FilterableProductOptionProps,
    data: ProductTypes.UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>

  @InjectManager("baseRepository_")
  async updateProductOptions(
    idOrSelector: string | ProductTypes.FilterableProductOptionProps,
    data: ProductTypes.UpdateProductOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO[] | ProductTypes.ProductOptionDTO> {
    let normalizedInput: UpdateProductOptionInput[] = []
    if (isString(idOrSelector)) {
      await this.productOptionService_.retrieve(idOrSelector, {}, sharedContext)
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const options = await this.productOptionService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = options.map((option) => ({
        id: option.id,
        ...data,
      }))
    }

    const options = await this.updateOptions_(normalizedInput, sharedContext)

    const updatedOptions = await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(options)

    return isString(idOrSelector) ? updatedOptions[0] : updatedOptions
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateOptions_(
    data: UpdateProductOptionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductOption[]> {
    // Validation step
    if (data.some((option) => !option.id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Tried to update options without specifying an ID"
      )
    }

    const dbOptions = await this.productOptionService_.list(
      { id: data.map(({ id }) => id) },
      { take: null, relations: ["values"] },
      sharedContext
    )

    if (dbOptions.length !== data.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot update non-existing options with ids: ${arrayDifference(
          data.map(({ id }) => id),
          dbOptions.map(({ id }) => id)
        ).join(", ")}`
      )
    }

    // Data normalization
    const normalizedInput = data.map((opt) => {
      const dbValues = dbOptions.find(({ id }) => id === opt.id)?.values || []
      const normalizedValues = opt.values?.map((v) => {
        return typeof v === "string" ? { value: v } : v
      })

      return {
        ...opt,
        ...(normalizedValues
          ? {
              // Oftentimes the options are only passed by value without an id, even if they exist in the DB
              values: normalizedValues.map((normVal) => {
                if ("id" in normVal) {
                  return normVal
                }

                const dbVal = dbValues.find(
                  (dbVal) => dbVal.value === normVal.value
                )
                if (!dbVal) {
                  return normVal
                }

                return {
                  id: dbVal.id,
                  value: normVal.value,
                }
              }),
            }
          : {}),
      } as UpdateProductOptionInput
    })

    const { entities: productOptions } =
      await this.productOptionService_.upsertWithReplace(
        normalizedInput,
        { relations: ["values"] },
        sharedContext
      )

    return productOptions
  }

  // @ts-ignore
  createProductCollections(
    data: ProductTypes.CreateProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>
  createProductCollections(
    data: ProductTypes.CreateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>

  @InjectManager("baseRepository_")
  async createProductCollections(
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
    >(collections)

    await this.eventBusModuleService_?.emit<ProductCollectionEventData>(
      collections.map(({ id }) => ({
        eventName: ProductCollectionEvents.COLLECTION_CREATED,
        data: { id },
      }))
    )

    return Array.isArray(data) ? createdCollections : createdCollections[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createCollections_(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductCollection[]> {
    const normalizedInput = data.map(
      ProductModuleService.normalizeCreateProductCollectionInput
    )

    // It's safe to use upsertWithReplace here since we only have product IDs and the only operation to do is update the product
    // with the collection ID
    const { entities: productCollections } =
      await this.productCollectionService_.upsertWithReplace(
        normalizedInput,
        { relations: ["products"] },
        sharedContext
      )

    return productCollections
  }

  async upsertProductCollections(
    data: ProductTypes.UpsertProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>
  async upsertProductCollections(
    data: ProductTypes.UpsertProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>
  @InjectTransactionManager("baseRepository_")
  async upsertProductCollections(
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
    >(result)

    if (created.length) {
      await this.eventBusModuleService_?.emit<ProductCollectionEventData>(
        created.map(({ id }) => ({
          eventName: ProductCollectionEvents.COLLECTION_CREATED,
          data: { id },
        }))
      )
    }

    if (updated.length) {
      await this.eventBusModuleService_?.emit<ProductCollectionEventData>(
        updated.map(({ id }) => ({
          eventName: ProductCollectionEvents.COLLECTION_UPDATED,
          data: { id },
        }))
      )
    }

    return Array.isArray(data) ? allCollections : allCollections[0]
  }

  // @ts-ignore
  updateProductCollections(
    id: string,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>
  updateProductCollections(
    selector: ProductTypes.FilterableProductCollectionProps,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>

  @InjectManager("baseRepository_")
  async updateProductCollections(
    idOrSelector: string | ProductTypes.FilterableProductCollectionProps,
    data: ProductTypes.UpdateProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
  > {
    let normalizedInput: UpdateCollectionInput[] = []
    if (isString(idOrSelector)) {
      await this.productCollectionService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
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

    await this.eventBusModuleService_?.emit<ProductCollectionEventData>(
      updatedCollections.map(({ id }) => ({
        eventName: ProductCollectionEvents.COLLECTION_UPDATED,
        data: { id },
      }))
    )

    return isString(idOrSelector) ? updatedCollections[0] : updatedCollections
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateCollections_(
    data: UpdateCollectionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductCollection[]> {
    const normalizedInput = data.map(
      ProductModuleService.normalizeUpdateProductCollectionInput
    ) as UpdateCollectionInput[]

    // TODO: Maybe we can update upsertWithReplace to not remove oneToMany entities, but just disassociate them? With that we can remove the code below.
    // Another alternative is to not allow passing product_ids to a collection, and instead set the collection_id through the product update call.
    const updatedCollections = await this.productCollectionService_.update(
      normalizedInput.map((c) =>
        removeUndefined({ ...c, products: undefined })
      ),
      sharedContext
    )

    const collections: ProductCollection[] = []

    const updateSelectorAndData = updatedCollections.flatMap(
      (collectionData) => {
        const input = normalizedInput.find((c) => c.id === collectionData.id)
        const productsToUpdate = (input as any)?.products

        const dissociateSelector = {
          collection_id: collectionData.id,
        }
        const associateSelector = {}

        if (!!productsToUpdate?.length) {
          const productIds = productsToUpdate.map((p) => p.id)
          dissociateSelector["id"] = { $nin: productIds }
          associateSelector["id"] = { $in: productIds }
        }

        const result: Record<string, any>[] = [
          {
            selector: dissociateSelector,
            data: {
              collection_id: null,
            },
          },
        ]

        if (isPresent(associateSelector)) {
          result.push({
            selector: associateSelector,
            data: {
              collection_id: collectionData.id,
            },
          })
        }

        collections.push({
          ...collectionData,
          products: productsToUpdate ?? [],
        } as ProductCollection)

        return result
      }
    )

    await this.productService_.update(updateSelectorAndData, sharedContext)
    return collections
  }

  // @ts-ignore
  createProductCategories(
    data: ProductTypes.CreateProductCategoryDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]>
  createProductCategories(
    data: ProductTypes.CreateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createProductCategories(
    data:
      | ProductTypes.CreateProductCategoryDTO[]
      | ProductTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO[] | ProductTypes.ProductCategoryDTO
  > {
    const input = Array.isArray(data) ? data : [data]

    const categories = await this.productCategoryService_.create(
      input,
      sharedContext
    )

    const createdCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(categories)

    eventBuilders.createdProductCategory({
      data: createdCategories,
      sharedContext,
    })

    return Array.isArray(data) ? createdCategories : createdCategories[0]
  }

  async upsertProductCategories(
    data: ProductTypes.UpsertProductCategoryDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]>
  async upsertProductCategories(
    data: ProductTypes.UpsertProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO>

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async upsertProductCategories(
    data:
      | ProductTypes.UpsertProductCategoryDTO[]
      | ProductTypes.UpsertProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO[] | ProductTypes.ProductCategoryDTO
  > {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (category): category is UpdateCategoryInput => !!category.id
    )
    const forCreate = input.filter(
      (category): category is ProductTypes.CreateProductCategoryDTO =>
        !category.id
    )

    let created: ProductCategory[] = []
    let updated: ProductCategory[] = []

    if (forCreate.length) {
      created = await this.productCategoryService_.create(
        forCreate,
        sharedContext
      )
    }
    if (forUpdate.length) {
      updated = await this.productCategoryService_.update(
        forUpdate,
        sharedContext
      )
    }

    const createdCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(created)
    const updatedCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(updated)

    eventBuilders.createdProductCategory({
      data: createdCategories,
      sharedContext,
    })

    eventBuilders.updatedProductCategory({
      data: updatedCategories,
      sharedContext,
    })

    const result = [...createdCategories, ...updatedCategories]
    return Array.isArray(data) ? result : result[0]
  }

  // @ts-ignore
  updateProductCategories(
    id: string,
    data: ProductTypes.UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO>
  updateProductCategories(
    selector: ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateProductCategories(
    idOrSelector: string | ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO[] | ProductTypes.ProductCategoryDTO
  > {
    let normalizedInput: UpdateCategoryInput[] = []
    if (isString(idOrSelector)) {
      // Check if the type exists in the first place
      await this.productCategoryService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const categories = await this.productCategoryService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = categories.map((type) => ({
        id: type.id,
        ...data,
      }))
    }

    const categories = await this.productCategoryService_.update(
      normalizedInput,
      sharedContext
    )

    const updatedCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(categories)

    eventBuilders.updatedProductCategory({
      data: updatedCategories,
      sharedContext,
    })

    return isString(idOrSelector) ? updatedCategories[0] : updatedCategories
  }

  //@ts-expect-error
  createProducts(
    data: ProductTypes.CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>
  createProducts(
    data: ProductTypes.CreateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>

  @InjectManager("baseRepository_")
  async createProducts(
    data: ProductTypes.CreateProductDTO[] | ProductTypes.CreateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    const input = Array.isArray(data) ? data : [data]
    const products = await this.createProducts_(input, sharedContext)

    const createdProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products)

    await this.eventBusModuleService_?.emit<ProductEventData>(
      createdProducts.map(({ id }) => ({
        eventName: ProductEvents.PRODUCT_CREATED,
        data: { id },
      }))
    )

    return Array.isArray(data) ? createdProducts : createdProducts[0]
  }

  async upsertProducts(
    data: ProductTypes.UpsertProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>
  async upsertProducts(
    data: ProductTypes.UpsertProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>

  @InjectTransactionManager("baseRepository_")
  async upsertProducts(
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
      created = await this.createProducts_(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.updateProducts_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[] | ProductTypes.ProductDTO
    >(result)

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

  // @ts-expect-error
  updateProducts(
    id: string,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>
  updateProducts(
    selector: ProductTypes.FilterableProductProps,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>

  @InjectManager("baseRepository_")
  async updateProducts(
    idOrSelector: string | ProductTypes.FilterableProductProps,
    data: ProductTypes.UpdateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    let normalizedInput: UpdateProductInput[] = []
    if (isString(idOrSelector)) {
      // This will throw if the product does not exist
      await this.productService_.retrieve(idOrSelector, {}, sharedContext)

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

    const products = await this.updateProducts_(normalizedInput, sharedContext)

    const updatedProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products)

    await this.eventBusModuleService_?.emit<ProductEventData>(
      updatedProducts.map(({ id }) => ({
        eventName: ProductEvents.PRODUCT_UPDATED,
        data: { id },
      }))
    )

    return isString(idOrSelector) ? updatedProducts[0] : updatedProducts
  }

  @InjectTransactionManager("baseRepository_")
  protected async createProducts_(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Product[]> {
    const normalizedInput = await promiseAll(
      data.map(async (d) => {
        const normalized = await this.normalizeCreateProductInput(
          d,
          sharedContext
        )
        this.validateProductPayload(normalized)
        return normalized
      })
    )

    const { entities: productData } =
      await this.productService_.upsertWithReplace(
        normalizedInput,
        {
          relations: ["images", "tags", "categories"],
        },
        sharedContext
      )

    await promiseAll(
      // Note: It's safe to rely on the order here as `upsertWithReplace` preserves the order of the input
      normalizedInput.map(async (product, i) => {
        const upsertedProduct: any = productData[i]
        upsertedProduct.options = []
        upsertedProduct.variants = []

        if (product.options?.length) {
          const { entities: productOptions } =
            await this.productOptionService_.upsertWithReplace(
              product.options?.map((option) => ({
                ...option,
                product_id: upsertedProduct.id,
              })) ?? [],
              { relations: ["values"] },
              sharedContext
            )
          upsertedProduct.options = productOptions
        }

        if (product.variants?.length) {
          const { entities: productVariants } =
            await this.productVariantService_.upsertWithReplace(
              ProductModuleService.assignOptionsToVariants(
                product.variants?.map((v) => ({
                  ...v,
                  product_id: upsertedProduct.id,
                })) ?? [],
                upsertedProduct.options
              ),
              { relations: ["options"] },
              sharedContext
            )
          upsertedProduct.variants = productVariants
        }
      })
    )

    return productData
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateProducts_(
    data: UpdateProductInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Product[]> {
    const normalizedInput = await promiseAll(
      data.map(async (d) => {
        const normalized = await this.normalizeUpdateProductInput(
          d,
          sharedContext
        )
        this.validateProductPayload(normalized)
        return normalized
      })
    )

    const { entities: productData } =
      await this.productService_.upsertWithReplace(
        normalizedInput,
        {
          relations: ["images", "tags", "categories"],
        },
        sharedContext
      )

    // There is more than 1-level depth of relations here, so we need to handle the options and variants manually
    await promiseAll(
      // Note: It's safe to rely on the order here as `upsertWithReplace` preserves the order of the input
      normalizedInput.map(async (product, i) => {
        const upsertedProduct: any = productData[i]
        let allOptions: any[] = []

        if (product.options?.length) {
          const { entities: productOptions } =
            await this.productOptionService_.upsertWithReplace(
              product.options?.map((option) => ({
                ...option,
                product_id: upsertedProduct.id,
              })) ?? [],
              { relations: ["values"] },
              sharedContext
            )
          upsertedProduct.options = productOptions

          // Since we handle the options and variants outside of the product upsert, we need to clean up manually
          await this.productOptionService_.delete(
            {
              product_id: upsertedProduct.id,
              id: {
                $nin: upsertedProduct.options.map(({ id }) => id),
              },
            },
            sharedContext
          )
          allOptions = upsertedProduct.options
        } else {
          // If the options weren't affected, but the user is changing the variants, make sure we have all options available locally
          if (product.variants?.length) {
            allOptions = await this.productOptionService_.list(
              { product_id: upsertedProduct.id },
              { take: null, relations: ["values"] },
              sharedContext
            )
          }
        }

        if (product.variants?.length) {
          const { entities: productVariants } =
            await this.productVariantService_.upsertWithReplace(
              ProductModuleService.assignOptionsToVariants(
                product.variants?.map((v) => ({
                  ...v,
                  product_id: upsertedProduct.id,
                })) ?? [],
                allOptions
              ),
              { relations: ["options"] },
              sharedContext
            )
          upsertedProduct.variants = productVariants

          await this.productVariantService_.delete(
            {
              product_id: upsertedProduct.id,
              id: {
                $nin: upsertedProduct.variants.map(({ id }) => id),
              },
            },
            sharedContext
          )
        }
      })
    )

    return productData
  }

  /**
   * Validates the manually provided handle value of the product
   * to be URL-safe
   */
  protected validateProductPayload(
    productData: UpdateProductInput | ProductTypes.CreateProductDTO
  ) {
    if (productData.handle && !isValidHandle(productData.handle)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid product handle. It must contain URL safe characters"
      )
    }
  }

  protected async normalizeCreateProductInput(
    product: ProductTypes.CreateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.CreateProductDTO> {
    const productData = (await this.normalizeUpdateProductInput(
      product as UpdateProductInput,
      sharedContext
    )) as ProductTypes.CreateProductDTO

    if (!productData.handle && productData.title) {
      productData.handle = toHandle(productData.title)
    }

    if (!productData.status) {
      productData.status = ProductStatus.DRAFT
    }

    if (!productData.thumbnail && productData.images?.length) {
      productData.thumbnail = productData.images[0].url
    }

    return productData
  }

  protected async normalizeUpdateProductInput(
    product: UpdateProductInput,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UpdateProductInput> {
    const productData = { ...product }
    if (productData.is_giftcard) {
      productData.discountable = false
    }

    if (productData.tags?.length && productData.tags.some((t) => !t.id)) {
      const dbTags = await this.productTagService_.list(
        {
          value: productData.tags
            .map((t) => t.value)
            .filter((v) => !!v) as string[],
        },
        { take: null },
        sharedContext
      )

      productData.tags = productData.tags.map((tag) => {
        const dbTag = dbTags.find((t) => t.value === tag.value)
        return {
          ...tag,
          ...(dbTag ? { id: dbTag.id } : {}),
        }
      })
    }

    if (productData.options?.length) {
      ;(productData as any).options = productData.options?.map((option) => {
        return {
          id: option.id,
          title: option.title,
          values: option.values?.map((value) => {
            return {
              value: value,
            }
          }),
        }
      })
    }

    if (productData.category_ids) {
      ;(productData as any).categories = productData.category_ids.map(
        (cid) => ({
          id: cid,
        })
      )
      delete productData.category_ids
    }

    return productData
  }

  protected static normalizeCreateProductCollectionInput(
    collection: ProductTypes.CreateProductCollectionDTO
  ): ProductTypes.CreateProductCollectionDTO {
    const collectionData =
      ProductModuleService.normalizeUpdateProductCollectionInput(
        collection
      ) as ProductTypes.CreateProductCollectionDTO

    if (!collectionData.handle && collectionData.title) {
      collectionData.handle = kebabCase(collectionData.title)
    }

    return collectionData
  }

  protected static normalizeUpdateProductCollectionInput(
    collection: ProductTypes.CreateProductCollectionDTO | UpdateCollectionInput
  ): ProductTypes.CreateProductCollectionDTO | UpdateCollectionInput {
    const collectionData = { ...collection }
    if (collectionData.product_ids?.length) {
      ;(collectionData as any).products = collectionData.product_ids.map(
        (pid) => ({
          id: pid,
        })
      )
      delete collectionData.product_ids
    }

    return collectionData
  }

  protected static assignOptionsToVariants(
    variants:
      | ProductTypes.CreateProductVariantDTO[]
      | ProductTypes.UpdateProductVariantDTO[],
    options: ProductOption[]
  ):
    | ProductTypes.CreateProductVariantDTO[]
    | ProductTypes.UpdateProductVariantDTO[] {
    if (!variants.length) {
      return variants
    }

    const variantsWithOptions = variants.map((variant: any) => {
      const variantOptions = Object.entries(variant.options ?? {}).map(
        ([key, val]) => {
          const option = options.find((o) => o.title === key)
          const optionValue = option?.values?.find(
            (v: any) => (v.value?.value ?? v.value) === val
          )

          if (!optionValue) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Option value ${val} does not exist for option ${key}`
            )
          }

          return {
            id: optionValue.id,
          }
        }
      )

      if (!variantOptions.length) {
        return variant
      }

      return {
        ...variant,
        options: variantOptions,
      }
    })

    return variantsWithOptions
  }
}
