import {
  Context,
  DAL,
  FilterableProductOptionValueProps,
  FindConfig,
  IEventBusModuleService,
  InferEntityType,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ProductTypes,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/framework/types"
import { CreateProductOptionDTO } from "@medusajs/types"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductImage,
  ProductOption,
  ProductOptionValue,
  ProductProductOption,
  ProductProductOptionValue,
  ProductTag,
  ProductType,
  ProductVariant,
  ProductVariantProductImage,
} from "@models"
import { ProductCategoryService } from "@services"

import {
  arrayDifference,
  createMedusaMikroOrmEventSubscriber,
  EmitEvents,
  generateEntityId,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isPresent,
  isString,
  isValidHandle,
  kebabCase,
  MedusaContext,
  MedusaError,
  MedusaService,
  MessageAggregator,
  Modules,
  partitionArray,
  ProductStatus,
  promiseAll,
  removeUndefined,
  toHandle,
} from "@medusajs/framework/utils"
import { EntityManager } from "@medusajs/framework/mikro-orm/core"
import { ProductRepository } from "../repositories"
import {
  UpdateCategoryInput,
  UpdateCollectionInput,
  UpdateProductInput,
  FilterableProduct,
  UpdateProductOptionInput,
  UpdateProductVariantInput,
  UpdateTagInput,
  UpdateTypeInput,
  VariantImageInputArray,
} from "../types"
import { computeOptionLinkChanges, eventBuilders } from "../utils"
import { joinerConfig } from "./../joiner-config"
import { buildOptionValueFilterQuery } from "../utils/build-option-value-filter-query"
import { resolveAllowedOptionValues } from "../utils/resolve-allowed-option-values"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productRepository: ProductRepository
  productService: ModulesSdkTypes.IMedusaInternalService<any, any>
  productVariantService: ModulesSdkTypes.IMedusaInternalService<any, any>
  productTagService: ModulesSdkTypes.IMedusaInternalService<any>
  productCategoryService: ProductCategoryService
  productCollectionService: ModulesSdkTypes.IMedusaInternalService<any>
  productImageService: ModulesSdkTypes.IMedusaInternalService<any>
  productImageProductService: ModulesSdkTypes.IMedusaInternalService<any>
  productTypeService: ModulesSdkTypes.IMedusaInternalService<any>
  productOptionService: ModulesSdkTypes.IMedusaInternalService<any>
  productProductOptionService: ModulesSdkTypes.IMedusaInternalService<any>
  productProductOptionValueService: ModulesSdkTypes.IMedusaInternalService<any>
  productOptionValueService: ModulesSdkTypes.IMedusaInternalService<any>
  productVariantProductImageService: ModulesSdkTypes.IMedusaInternalService<any>
  [Modules.EVENT_BUS]?: IEventBusModuleService
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
    ProductOptionValue: {
      dto: ProductTypes.ProductOptionValueDTO
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
    ProductImage: {
      dto: ProductTypes.ProductImageDTO
    }
    ProductProductOption: {
      dto: ProductTypes.ProductProductOptionDTO
    }
  }>({
    Product,
    ProductCategory,
    ProductCollection,
    ProductOption,
    ProductOptionValue,
    ProductTag,
    ProductType,
    ProductVariant,
    ProductImage,
    ProductProductOption,
  })
  implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productRepository_: ProductRepository
  protected readonly productService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Product>
  >
  protected readonly productVariantService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductVariant>
  >
  protected readonly productCategoryService_: ProductCategoryService
  protected readonly productTagService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductTag>
  >
  protected readonly productCollectionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductCollection>
  >
  protected readonly productImageService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductImage>
  >
  protected readonly productTypeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductType>
  >
  protected readonly productOptionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductOption>
  >
  protected readonly productOptionValueService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductOptionValue>
  >
  protected readonly productProductOptionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductProductOption>
  >
  protected readonly productProductOptionValueService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductProductOptionValue>
  >
  protected readonly productVariantProductImageService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProductVariantProductImage>
  >
  protected readonly eventBusModuleService_?: IEventBusModuleService

  constructor(
    {
      baseRepository,
      productRepository,
      productService,
      productVariantService,
      productTagService,
      productCategoryService,
      productCollectionService,
      productImageService,
      productTypeService,
      productOptionService,
      productProductOptionService,
      productProductOptionValueService,
      productOptionValueService,
      productVariantProductImageService,
      [Modules.EVENT_BUS]: eventBusModuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.productRepository_ = productRepository
    this.productService_ = productService
    this.productVariantService_ = productVariantService
    this.productTagService_ = productTagService
    this.productCategoryService_ = productCategoryService
    this.productCollectionService_ = productCollectionService
    this.productImageService_ = productImageService
    this.productTypeService_ = productTypeService
    this.productOptionService_ = productOptionService
    this.productProductOptionService_ = productProductOptionService
    this.productProductOptionValueService_ = productProductOptionValueService
    this.productOptionValueService_ = productOptionValueService
    this.productVariantProductImageService_ = productVariantProductImageService
    this.eventBusModuleService_ = eventBusModuleService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager()
  // @ts-ignore
  async retrieveProduct(
    productId: string,
    config?: FindConfig<ProductTypes.ProductDTO>,
    @MedusaContext() sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO> {
    const relationsSet = new Set(config?.relations ?? [])

    relationsSet.delete("product_options")
    relationsSet.delete("product_options.values")
    relationsSet.delete("product_options.product_option")

    const shouldLoadVariantImages = relationsSet.has("variants.images")
    const shouldFilterOptionValues = relationsSet.has("options.values")

    if (shouldLoadVariantImages) {
      relationsSet.add("variants")
      relationsSet.add("images")
    }

    if (shouldFilterOptionValues) {
      relationsSet.add("options")
      relationsSet.add("options.values")
    }

    const product = await this.productService_.retrieve(
      productId,
      this.getProductFindConfig_({
        ...config,
        relations: Array.from(relationsSet),
      }),
      sharedContext
    )

    const serializedProduct =
      await this.baseRepository_.serialize<ProductTypes.ProductDTO>(product)

    if (shouldLoadVariantImages) {
      await this.assignImagesToVariants([serializedProduct], sharedContext)
    }

    if (shouldFilterOptionValues) {
      await this.filterOptionValues(serializedProduct, sharedContext)
    }

    return serializedProduct
  }

  @InjectManager()
  // @ts-ignore
  async listProducts(
    filters?: ProductTypes.FilterableProductProps,
    config?: FindConfig<ProductTypes.ProductDTO>,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]> {
    const { filters: normalizedFilters, shouldReturnEmpty } =
      await this.applyOptionValueFilter_(filters, sharedContext)

    if (shouldReturnEmpty) {
      return []
    }

    const relationsSet = new Set(config?.relations ?? [])
    const shouldLoadVariantImages = relationsSet.has("variants.images")
    if (shouldLoadVariantImages) {
      relationsSet.add("variants")
      relationsSet.add("images")
    }

    const shouldFilterOptionValues = relationsSet.has("options.values")

    if (shouldFilterOptionValues) {
      relationsSet.add("options")
      relationsSet.add("options.values")
    }

    const products = await this.productService_.list(
      normalizedFilters,
      this.getProductFindConfig_({
        ...config,
        relations: Array.from(relationsSet),
      }),
      sharedContext
    )

    const serializedProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products)

    if (shouldLoadVariantImages) {
      await this.assignImagesToVariants(serializedProducts, sharedContext)
    }

    if (shouldFilterOptionValues) {
      await this.filterOptionValues(serializedProducts, sharedContext)
    }

    return serializedProducts
  }

  @InjectManager()
  // @ts-ignore
  async listAndCountProducts(
    filters?: ProductTypes.FilterableProductProps,
    config?: FindConfig<ProductTypes.ProductDTO>,
    sharedContext?: Context
  ): Promise<[ProductTypes.ProductDTO[], number]> {
    const { filters: normalizedFilters, shouldReturnEmpty } =
      await this.applyOptionValueFilter_(filters, sharedContext)

    if (shouldReturnEmpty) {
      return [[], 0]
    }

    const shouldLoadVariantImages =
      config?.relations?.includes("variants.images")
    const shouldFilterOptionValues =
      config?.relations?.includes("options.values")

    // Ensure we load necessary relations
    let relations = [...(config?.relations || [])]
    relations = relations.filter(
      (relation) =>
        relation !== "product_options" &&
        relation !== "product_options.values" &&
        relation !== "product_options.product_option"
    )
    if (shouldLoadVariantImages) {
      if (!relations.includes("variants")) {
        relations.push("variants")
      }
      if (!relations.includes("images")) {
        relations.push("images")
      }
    }

    if (shouldFilterOptionValues) {
      if (!relations.includes("options")) {
        relations.push("options")
      }
      if (!relations.includes("options.values")) {
        relations.push("options.values")
      }
    }

    const [products, count] = await this.productService_.listAndCount(
      normalizedFilters,
      this.getProductFindConfig_({ ...config, relations }),
      sharedContext
    )

    const serializedProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products)

    if (shouldLoadVariantImages) {
      await this.assignImagesToVariants(serializedProducts, sharedContext)
    }
    
    if (shouldFilterOptionValues) {
      await this.filterOptionValues(serializedProducts, sharedContext)
    }

    return [serializedProducts, count]
  }

  protected async applyOptionValueFilter_(
    filters?: ProductTypes.FilterableProductProps,
    sharedContext?: Context
  ): Promise<{
    filters?: ProductTypes.FilterableProductProps
    shouldReturnEmpty: boolean
  }> {
    if (!filters?.option_value_id) {
      return {
        filters: filters,
        shouldReturnEmpty: false,
      }
    }

    const optionValueIds = Array.isArray(filters.option_value_id)
      ? filters.option_value_id
      : [filters.option_value_id]

    if (!optionValueIds.length) {
      return {
        filters: filters,
        shouldReturnEmpty: false,
      }
    }

    const optionValueFilter = await buildOptionValueFilterQuery(
      optionValueIds,
      sharedContext
    )

    if (!optionValueFilter) {
      return {
        filters: filters,
        shouldReturnEmpty: true,
      }
    }

    const { option_value_id, ...restFilters } = filters

    return {
      filters: {
        ...restFilters,
        ...optionValueFilter,
      },
      shouldReturnEmpty: false,
    }
  }

  protected getProductFindConfig_(
    config?: FindConfig<ProductTypes.ProductDTO>
  ): FindConfig<ProductTypes.ProductDTO> {
    const hasImagesRelation = config?.relations?.includes("images")

    return {
      ...config,
      order: {
        ...(config?.order ?? { id: "ASC" }),
        ...(hasImagesRelation
          ? {
              images: {
                rank: "ASC",
                ...((config?.order?.images as object) ?? {}),
              },
            }
          : {}),
      },
    }
  }

  // @ts-expect-error
  createProductVariants(
    data: ProductTypes.CreateProductVariantDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]>
  // @ts-expect-error
  createProductVariants(
    data: ProductTypes.CreateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async createVariants_(
    data: ProductTypes.CreateProductVariantDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductVariant>[]> {
    if (data.some((v) => !v.product_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Unable to create variants without specifying a product_id"
      )
    }

    const productIds = [...new Set<string>(data.map((v) => v.product_id!))]
    const [variants, { optionsByProductId, valueIdsByProductId }] =
    await promiseAll([
      this.productVariantService_.list(
        { product_id: productIds },
        { relations: ["options"] },
        sharedContext
      ),
      this.loadOptionsAndValuesByProductId_(productIds, sharedContext),
    ])

    const productVariantsWithOptions =
      ProductModuleService.assignOptionsToVariants(
        data,
        optionsByProductId,
        valueIdsByProductId
      )

    ProductModuleService.checkIfVariantWithOptionsAlreadyExists(
      productVariantsWithOptions as any,
      variants
    )

    const createdVariants = await this.productVariantService_.create(
      productVariantsWithOptions,
      sharedContext
    )

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

  @InjectTransactionManager()
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

    let created: ProductTypes.ProductVariantDTO[] = []
    let updated: InferEntityType<typeof ProductVariant>[] = []

    if (forCreate.length) {
      created = await this.createProductVariants(forCreate, sharedContext)
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

  // @ts-expect-error
  updateProductVariants(
    id: string,
    data: ProductTypes.UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO>
  // @ts-expect-error
  updateProductVariants(
    selector: ProductTypes.FilterableProductVariantProps,
    data: ProductTypes.UpdateProductVariantDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async updateVariants_(
    data: UpdateProductVariantInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductVariant>[]> {
    // Whether any variant in this batch is changing its options. The option
    // resolution + uniqueness validation + relation reconcile below are ONLY
    // needed in that case. When no variant carries `options`, all of that work is
    // dead weight — and on a product with a large number of variants it is very
    // expensive (see below), so we skip it.
    const hasOptions = data.some((d) => !!d.options)

    // Validation step
    const variantIdsToUpdate = data.map(({ id }) => id)
    const variants = await this.productVariantService_.list(
      { id: variantIdsToUpdate },
      {},
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

    let productVariantsWithOptions: UpdateProductVariantInput[] =
      variantsWithProductId

    if (hasOptions) {
      // Loading EVERY variant of the affected products (with their options) and
      // the option-tuple uniqueness scan are O(product's total variant count) and
      // synchronous. They are only required to validate that an options change
      // does not create a duplicate option combination — so only run them when an
      // options change is actually being made. For products with many variants
      // (thousands), doing this unconditionally on a scalar-only update blocks the
      // event loop for tens of seconds.
      const allVariants = await this.productVariantService_.list(
        { product_id: variants.map((v) => v.product_id) },
        { relations: ["options"] },
        sharedContext
      )

      const productIds = Array.from(
        new Set(variantsWithProductId.map((v) => v.product_id!))
      )
      const { optionsByProductId, valueIdsByProductId } =
        await this.loadOptionsAndValuesByProductId_(productIds, sharedContext)

      productVariantsWithOptions = ProductModuleService.assignOptionsToVariants(
        variantsWithProductId,
        optionsByProductId,
        valueIdsByProductId
      ) as UpdateProductVariantInput[]

      ProductModuleService.checkIfVariantWithOptionsAlreadyExists(
        productVariantsWithOptions as any,
        allVariants
      )
    }

    const { entities: productVariants } =
      await this.productVariantService_.upsertWithReplace(
        productVariantsWithOptions,
        {
          // Only reconcile the options relation when options are actually being
          // updated. With no options in the payload the relation loop is a no-op
          // for these entries anyway, so this avoids the relation setup entirely.
          relations: hasOptions ? ["options"] : [],
        },
        sharedContext
      )

    return productVariants
  }

  // @ts-expect-error
  createProductTags(
    data: ProductTypes.CreateProductTagDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]>
  // @ts-expect-error
  createProductTags(
    data: ProductTypes.CreateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createProductTags(
    data: ProductTypes.CreateProductTagDTO[] | ProductTypes.CreateProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO> {
    const input = Array.isArray(data) ? data : [data]

    const tags = await this.productTagService_.create(input, sharedContext)

    const createdTags = await this.baseRepository_.serialize<
      ProductTypes.ProductTagDTO[]
    >(tags)

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

  @InjectManager()
  @EmitEvents()
  async upsertProductTags(
    data: ProductTypes.UpsertProductTagDTO[] | ProductTypes.UpsertProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO> {
    const tags = await this.upsertProductTags_(data, sharedContext)

    const allTags = await this.baseRepository_.serialize<
      ProductTypes.ProductTagDTO[] | ProductTypes.ProductTagDTO
    >(Array.isArray(data) ? tags : tags[0])

    return allTags
  }

  @InjectTransactionManager()
  protected async upsertProductTags_(
    data: ProductTypes.UpsertProductTagDTO[] | ProductTypes.UpsertProductTagDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductTag>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((tag): tag is UpdateTagInput => !!tag.id)
    const forCreate = input.filter(
      (tag): tag is ProductTypes.CreateProductTagDTO => !tag.id
    )

    let created: InferEntityType<typeof ProductTag>[] = []
    let updated: InferEntityType<typeof ProductTag>[] = []

    if (forCreate.length) {
      created = await this.productTagService_.create(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.productTagService_.update(forUpdate, sharedContext)
    }

    return [...created, ...updated]
  }

  // @ts-expect-error
  updateProductTags(
    id: string,
    data: ProductTypes.UpdateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO>
  // @ts-expect-error
  updateProductTags(
    selector: ProductTypes.FilterableProductTagProps,
    data: ProductTypes.UpdateProductTagDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    return isString(idOrSelector) ? updatedTags[0] : updatedTags
  }

  // @ts-expect-error
  createProductTypes(
    data: ProductTypes.CreateProductTypeDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO[]>
  // @ts-expect-error
  createProductTypes(
    data: ProductTypes.CreateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectManager()
  @EmitEvents()
  async upsertProductTypes(
    data:
      | ProductTypes.UpsertProductTypeDTO[]
      | ProductTypes.UpsertProductTypeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO> {
    const types = await this.upsertProductTypes_(data, sharedContext)

    const result = await this.baseRepository_.serialize<
      ProductTypes.ProductTypeDTO[] | ProductTypes.ProductTypeDTO
    >(types)

    return Array.isArray(data) ? result : result[0]
  }

  @InjectTransactionManager()
  protected async upsertProductTypes_(
    data:
      | ProductTypes.UpsertProductTypeDTO
      | ProductTypes.UpsertProductTypeDTO[],
    sharedContext?: Context
  ): Promise<InferEntityType<typeof ProductType>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter((type): type is UpdateTypeInput => !!type.id)
    const forCreate = input.filter(
      (type): type is ProductTypes.CreateProductTypeDTO => !type.id
    )

    let created: InferEntityType<typeof ProductType>[] = []
    let updated: InferEntityType<typeof ProductType>[] = []

    if (forCreate.length) {
      created = await this.productTypeService_.create(forCreate, sharedContext)
    }
    if (forUpdate.length) {
      updated = await this.productTypeService_.update(forUpdate, sharedContext)
    }

    return [...created, ...updated]
  }

  // @ts-expect-error
  updateProductTypes(
    id: string,
    data: ProductTypes.UpdateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO>
  // @ts-expect-error
  updateProductTypes(
    selector: ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductTypeDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTypeDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  // @ts-expect-error
  createProductOptions(
    data: ProductTypes.CreateProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>
  // @ts-expect-error
  createProductOptions(
    data: ProductTypes.CreateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

  @InjectTransactionManager()
  protected async createOptions_(
    data: ProductTypes.CreateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductOption>[]> {
    const normalizedInput = data.map((opt) => {
      Object.keys(opt.ranks ?? []).forEach((value) => {
        if (!opt.values.includes(value)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Value "${value}" is assigned a rank but is not defined in the list of values.`
          )
        }
      })

      return {
        ...opt,
        values: opt.values?.map((v) => {
          // Normalize each value into an object and attach rank if available
          const valueObj = isString(v) ? { value: v } : v
          const rank =
            opt.ranks && isString(v)
              ? opt.ranks[v]
              : opt.ranks?.[valueObj.value]

          return rank !== undefined ? { ...valueObj, rank } : valueObj
        }),
      }
    })

    return this.productOptionService_.create(normalizedInput, sharedContext)
  }

  async upsertProductOptions(
    data: ProductTypes.UpsertProductOptionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>
  async upsertProductOptions(
    data: ProductTypes.UpsertProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>

  @InjectTransactionManager()
  @EmitEvents()
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

    let created: InferEntityType<typeof ProductOption>[] = []
    let updated: InferEntityType<typeof ProductOption>[] = []

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

  // @ts-expect-error
  updateProductOptions(
    id: string,
    data: ProductTypes.UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO>
  // @ts-expect-error
  updateProductOptions(
    selector: ProductTypes.FilterableProductOptionProps,
    data: ProductTypes.UpdateProductOptionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateProductOptions(
    idOrSelector: string | ProductTypes.FilterableProductOptionProps,
    data: ProductTypes.UpdateProductOptionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO[] | ProductTypes.ProductOptionDTO> {
    let normalizedInput: UpdateProductOptionInput[] = []
    if (isString(idOrSelector)) {
      const option = await this.productOptionService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
      normalizedInput = [{ id: idOrSelector, ...data }]

      if (data.is_exclusive && option.is_exclusive === false) {
        // disable changing global option to exclusive
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot change product option: ${option.id} from global to exclusive.`
        )
      }
    } else {
      const options = await this.productOptionService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = options.map((option) => {
        if (data.is_exclusive && option.is_exclusive === false) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Cannot change product option: ${option.id} from global to exclusive.`
          )
        }

        return {
          id: option.id,
          ...data,
        }
      })
    }

    const options = await this.updateOptions_(normalizedInput, sharedContext)

    const updatedOptions = await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(options)

    return isString(idOrSelector) ? updatedOptions[0] : updatedOptions
  }

  @InjectTransactionManager()
  protected async updateOptions_(
    data: UpdateProductOptionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductOption>[]> {
    // Validation step
    if (data.some((option) => !option.id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Tried to update options without specifying an ID"
      )
    }

    const dbOptions = await this.productOptionService_.list(
      { id: data.map(({ id }) => id) },
      { relations: ["values"] },
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

    const dbOptionsMap = new Map<string, InferEntityType<typeof ProductOption>>(
      dbOptions.map((option) => [option.id, option])
    )

    // Check if any option values are being removed and if they're associated with products
    const removedValueIds = new Set<string>()
    for (const opt of data) {
      if (!isDefined(opt.values)) {
        continue
      }

      const dbOption = dbOptionsMap.get(opt.id)

      if (!dbOption) {
        continue
      }

      const newValues = new Set<string>(
        opt.values.map((v) => {
          if (isString(v)) {
            return v
          }
          return (v as any).value
        })
      )

      for (const existingValue of dbOption.values || []) {
        if (!newValues.has(existingValue.value)) {
          removedValueIds.add(existingValue.id)
        }
      }
    }

    await this.validateOptionValuesNotAssociatedWithProducts_(
      [...removedValueIds],
      sharedContext
    )

    // Data normalization
    const normalizedInput = data.map((opt) => {
      const dbOption = dbOptions.find(({ id }) => id === opt.id)
      const dbValues = dbOption?.values || []

      if (opt.ranks) {
        const validValues = opt.values ?? dbValues.map((v) => v.value)

        Object.keys(opt.ranks).forEach((value) => {
          if (!validValues.includes(value)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Value "${value}" is assigned a rank but is not defined in the list of values.`
            )
          }
        })
      }

      let normalizedValues
      if (opt.values) {
        // If new values are provided → normalize and apply ranks
        normalizedValues = opt.values.map((v) => {
          const valueObj = isString(v) ? { value: v } : v

          const rank =
            opt.ranks && isString(v)
              ? opt.ranks[v]
              : opt.ranks?.[valueObj.value]

          const rankedValue =
            rank !== undefined ? { ...valueObj, rank } : valueObj

          if ("id" in rankedValue) {
            return rankedValue
          }

          const dbVal = dbValues.find(
            (dbVal) => dbVal.value === rankedValue.value
          )
          if (!dbVal) {
            return rankedValue
          }

          return {
            id: dbVal.id,
            ...rankedValue,
          }
        })
      } else if (opt.ranks) {
        // If only ranks were provided → update existing DB values with ranks
        normalizedValues = dbValues.map((dbVal) => {
          const rank = opt.ranks![dbVal.value]
          return rank !== undefined
            ? { id: dbVal.id, value: dbVal.value, rank }
            : { id: dbVal.id, value: dbVal.value }
        })
      }

      const { ranks, ...cleanOpt } = opt
      return {
        ...cleanOpt,
        ...(normalizedValues ? { values: normalizedValues } : {}),
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

  /**
   * Guards against removing product option values that are still associated
   * with products. Shared by the option update flow (when values are removed)
   * and the option value deletion flow.
   */
  protected async validateOptionValuesNotAssociatedWithProducts_(
    valueIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    if (!valueIds.length) {
      return
    }

    const productProductOptionValues =
      await this.productProductOptionValueService_.list(
        {
          product_option_value_id: valueIds,
        },
        {
          select: ["id"],
          take: 1,
        },
        sharedContext
      )

    if (productProductOptionValues.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot delete product option values that are associated with products."
      )
    }
  }

  @InjectManager()
  // @ts-expect-error
  async softDeleteProductOptions<
    TReturnableLinkableKeys extends string = string
  >(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.softDeleteProductOptions_(
      primaryKeyValues,
      config,
      sharedContext
    )
  }

  @InjectTransactionManager()
  protected async softDeleteProductOptions_<
    TReturnableLinkableKeys extends string = string
  >(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const optionIds = Array.isArray(primaryKeyValues)
      ? primaryKeyValues.map((v) => (isString(v) ? v : (v as any).id))
      : [
          isString(primaryKeyValues)
            ? primaryKeyValues
            : (primaryKeyValues as any).id,
        ]

    const canDelete = await this.productRepository_.canDeleteProductOption(
      optionIds,
      sharedContext
    )

    if (!canDelete) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot delete product options that are associated with products."
      )
    }

    const productProductOptions = await this.productProductOptionService_.list(
      {
        product_option_id: optionIds,
      },
      {
        select: ["id"],
      },
      sharedContext
    )

    const productProductOptionIds = productProductOptions.map((ppo) => ppo.id)

    if (productProductOptionIds.length) {
      const productProductOptionValues =
        await this.productProductOptionValueService_.list(
          {
            product_product_option_id: productProductOptionIds,
          },
          {
            select: ["id"],
          },
          sharedContext
        )

      const productProductOptionValueIds = productProductOptionValues.map(
        (ppov) => ppov.id
      )

      if (productProductOptionValueIds.length) {
        await this.productProductOptionValueService_.softDelete(
          productProductOptionValueIds,
          sharedContext
        )
      }
    }

    if (productProductOptionIds.length) {
      await this.productProductOptionService_.softDelete(
        productProductOptionIds,
        sharedContext
      )
    }

    return await super.softDeleteProductOptions(
      primaryKeyValues,
      config,
      sharedContext
    )
  }

  @InjectManager()
  // @ts-expect-error
  async softDeleteProductOptionValues<
    TReturnableLinkableKeys extends string = string
  >(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.softDeleteProductOptionValues_(
      primaryKeyValues,
      config,
      sharedContext
    )
  }

  @InjectTransactionManager()
  protected async softDeleteProductOptionValues_<
    TReturnableLinkableKeys extends string = string
  >(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const valueIds = (
      Array.isArray(primaryKeyValues) ? primaryKeyValues : [primaryKeyValues]
    ).map((v) => (isString(v) ? v : (v as any).id))

    await this.validateOptionValuesNotAssociatedWithProducts_(
      valueIds,
      sharedContext
    )

    return await super.softDeleteProductOptionValues(
      primaryKeyValues,
      config,
      sharedContext
    )
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async restoreProductOptions<TReturnableLinkableKeys extends string>(
    ids: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    return await this.restoreProductOptions_(ids, config, sharedContext)
  }

  @InjectTransactionManager()
  protected async restoreProductOptions_<
    TReturnableLinkableKeys extends string
  >(
    ids: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<string, string[]> | void> {
    const optionIds = Array.isArray(ids)
      ? ids.map((v) => (isString(v) ? v : (v as any).id))
      : [isString(ids) ? ids : (ids as any).id]

    const productProductOptions = await this.productProductOptionService_.list(
      {
        product_option_id: optionIds,
      },
      {
        select: ["id"],
        withDeleted: true,
      },
      sharedContext
    )

    const productProductOptionIds = productProductOptions.map((ppo) => ppo.id)

    if (productProductOptionIds.length) {
      const productProductOptionValues =
        await this.productProductOptionValueService_.list(
          {
            product_product_option_id: productProductOptionIds,
          },
          {
            select: ["id"],
            withDeleted: true,
          },
          sharedContext
        )

      const productProductOptionValueIds = productProductOptionValues.map(
        (ppov) => ppov.id
      )

      if (productProductOptionValueIds.length) {
        await this.productProductOptionValueService_.restore(
          productProductOptionValueIds,
          sharedContext
        )
      }
    }

    if (productProductOptionIds.length) {
      await this.productProductOptionService_.restore(
        productProductOptionIds,
        sharedContext
      )
    }

    return await super.restoreProductOptions(ids, config, sharedContext)
  }

  async addProductOptionToProduct(
    productOptionProductPair: ProductTypes.ProductOptionProductPair,
    sharedContext?: Context
  ): Promise<{ id: string }>

  async addProductOptionToProduct(
    productOptionProductPairs: ProductTypes.ProductOptionProductPair[],
    sharedContext?: Context
  ): Promise<{ id: string }[]>

  @InjectManager()
  @EmitEvents()
  async addProductOptionToProduct(
    data:
      | ProductTypes.ProductOptionProductPair
      | ProductTypes.ProductOptionProductPair[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ id: string } | { id: string }[]> {
    const productOptionProducts = await this.addProductOptionToProduct_(
      data,
      sharedContext
    )

    return productOptionProducts
  }

  @InjectTransactionManager()
  protected async addProductOptionToProduct_(
    data:
      | ProductTypes.ProductOptionProductPair
      | ProductTypes.ProductOptionProductPair[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ id: string } | { id: string }[]> {
    const pairs = Array.isArray(data) ? data : [data]
    if (Array.isArray(data) && !data.length) {
      return []
    }

    const uniqueOptionIds = [...new Set(pairs.map((p) => p.product_option_id))]

    // Read option values via a direct knex query rather than
    // productOptionService_.list({...,relations:["values"]}). That MikroORM
    // path can return an option whose `.values` collection is stale (cached
    // empty in the identity map) when the option was created earlier in the
    // same transaction — which silently produces no value pivot rows below.
    // Callers that persist options in the same transaction (e.g.
    // createProducts_) are responsible for flushing before calling this.
    // Use the transaction-bound knex so we see writes that have been flushed
    // but not committed yet.
    const manager = (sharedContext.transactionManager ??
      sharedContext.manager) as any
    const knex = manager.getTransactionContext() ?? manager.getKnex()
    const optionValuesRows: { id: string; option_id: string }[] = await knex(
      "product_option_value"
    )
      .select("id", "option_id")
      .whereIn("option_id", uniqueOptionIds)
      .whereNull("deleted_at")

    const optionValuesMap = new Map<string, { id: string }[]>()
    for (const row of optionValuesRows) {
      const list = optionValuesMap.get(row.option_id) ?? []
      list.push({ id: row.id })
      optionValuesMap.set(row.option_id, list)
    }

    const assignmentConflicts =
      await this.productRepository_.canAssignProductOptionToProduct(
        pairs.map((pair) => ({
          productId: pair.product_id,
          optionId: pair.product_option_id,
        })),
        sharedContext
      )

    if (assignmentConflicts.alreadyLinkedOptionIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options are already linked to products: ${assignmentConflicts.alreadyLinkedOptionIds.join(
          ", "
        )}`
      )
    }

    if (assignmentConflicts.exclusiveOptionIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product options are already assigned to another product: ${assignmentConflicts.exclusiveOptionIds.join(
          ", "
        )}`
      )
    }

    const pposToCreate: Array<{
      product_id: string
      product_option_id: string
    }> = []

    for (const pair of pairs) {
      pposToCreate.push({
        product_id: pair.product_id,
        product_option_id: pair.product_option_id,
      })
    }

    const createdPPOs = pposToCreate.length
      ? await this.productProductOptionService_.create(
          pposToCreate,
          sharedContext
        )
      : []

    const ppoIdByKey = new Map<string, string>()
    for (const ppo of createdPPOs) {
      const key = `${ppo.product_id}_${ppo.product_option_id}`
      ppoIdByKey.set(key, ppo.id)
    }

    const ppovToCreate: Array<{
      product_product_option_id: string
      product_option_value_id: string
    }> = []
    for (const pair of pairs) {
      const key = `${pair.product_id}_${pair.product_option_id}`
      const productProductOptionId = ppoIdByKey.get(key)
      if (!productProductOptionId) {
        continue
      }

      const allValues = optionValuesMap.get(pair.product_option_id) || []
      const valueIds =
        pair.product_option_value_ids ?? allValues.map((v) => v.id)

      for (const valueId of valueIds) {
        ppovToCreate.push({
          product_product_option_id: productProductOptionId,
          product_option_value_id: valueId,
        })
      }
    }

    if (ppovToCreate.length) {
      await this.productProductOptionValueService_.create(
        ppovToCreate,
        sharedContext
      )
    }

    const result = pairs.map((pair) => ({
      id: ppoIdByKey.get(`${pair.product_id}_${pair.product_option_id}`)!,
    }))

    return Array.isArray(data) ? result : result[0]
  }

  async removeProductOptionFromProduct(
    groupCustomerPair: ProductTypes.ProductOptionProductPair,
    sharedContext?: Context
  ): Promise<void>

  async removeProductOptionFromProduct(
    groupCustomerPairs: ProductTypes.ProductOptionProductPair[],
    sharedContext?: Context
  ): Promise<void>

  @InjectManager()
  @EmitEvents()
  async removeProductOptionFromProduct(
    data:
      | ProductTypes.ProductOptionProductPair
      | ProductTypes.ProductOptionProductPair[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removeProductOptionFromProduct_(data, new Set(), sharedContext)
  }

  @InjectTransactionManager()
  protected async removeProductOptionFromProduct_(
    data:
      | ProductTypes.ProductOptionProductPair
      | ProductTypes.ProductOptionProductPair[],
    alreadyValidatedProductIds: Set<string>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const pairs = Array.isArray(data) ? data : [data]
    const productOptionsProducts = await this.productProductOptionService_.list(
      {
        $or: pairs,
      },
      {},
      sharedContext
    )

    const validationPairs = productOptionsProducts
      .map((productOptionProduct) => {
        const productId = productOptionProduct.product_id
        const optionId = productOptionProduct.product_option_id
        if (
          productId &&
          optionId &&
          !alreadyValidatedProductIds.has(productId)
        ) {
          return { productId, optionId }
        }
        return null
      })
      .filter((p): p is { productId: string; optionId: string } => p !== null)

    if (validationPairs.length > 0) {
      await this.validateOptionRemoval_(validationPairs, sharedContext)
    }

    const productOptionsProductIds = productOptionsProducts.map(({ id }) => id)

    await this.productProductOptionValueService_.delete(
      productOptionsProductIds.map((id) => ({ product_product_option_id: id })),
      sharedContext
    )

    await this.productProductOptionService_.delete(
      productOptionsProductIds,
      sharedContext
    )
  }

  async updateProductOptionValuesOnProduct(
    update: ProductTypes.ProductOptionProductValueUpdate,
    sharedContext?: Context
  ): Promise<void>

  async updateProductOptionValuesOnProduct(
    updates: ProductTypes.ProductOptionProductValueUpdate[],
    sharedContext?: Context
  ): Promise<void>

  @InjectManager()
  @EmitEvents()
  async updateProductOptionValuesOnProduct(
    data:
      | ProductTypes.ProductOptionProductValueUpdate
      | ProductTypes.ProductOptionProductValueUpdate[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.updateProductOptionValuesOnProduct_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async updateProductOptionValuesOnProduct_(
    data:
      | ProductTypes.ProductOptionProductValueUpdate
      | ProductTypes.ProductOptionProductValueUpdate[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const updates = Array.isArray(data) ? data : [data]
    const effectiveUpdates = updates.filter(
      (pair) => pair.add?.length || pair.remove?.length
    )

    if (!effectiveUpdates.length) {
      return
    }

    const existingProductOptions = await this.productProductOptionService_.list(
      {
        $or: effectiveUpdates.map((pair) => ({
          product_id: pair.product_id,
          product_option_id: pair.product_option_id,
        })),
      },
      { relations: ["values"] },
      sharedContext
    )

    const existingPPOMap = new Map<
      string,
      InferEntityType<typeof ProductProductOption>
    >()
    existingProductOptions.forEach((ppo) => {
      const key = `${ppo.product_id}_${ppo.product_option_id}`
      existingPPOMap.set(key, ppo)
    })

    const missingPairs = effectiveUpdates.filter((pair) => {
      const key = `${pair.product_id}_${pair.product_option_id}`
      return !existingPPOMap.has(key)
    })

    if (missingPairs.length) {
      const missingPairsLabel = missingPairs
        .map((pair) => `${pair.product_id}:${pair.product_option_id}`)
        .join(", ")
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Some product options are not linked to products: [${missingPairsLabel}]`
      )
    }

    const validationPairs = effectiveUpdates
      .filter((pair) => pair.remove?.length)
      .map((pair) => ({
        productId: pair.product_id,
        optionId: pair.product_option_id,
        valueIdsToCheck: pair.remove!,
      }))

    if (validationPairs.length) {
      await this.validateOptionRemoval_(validationPairs, sharedContext)
    }

    // if some values are passed as a create object - create those option values first and return array of value ids to assign to PPOs
    const normalizedUpdates = await this.normalizeProductOptionValueUpdates_(
      effectiveUpdates,
      sharedContext
    )

    const ppovToCreate: Array<{
      product_product_option_id: string
      product_option_value_id: string
    }> = []
    const ppovToDelete: Array<{
      product_product_option_id: string
      product_option_value_id: string
    }> = []

    normalizedUpdates.forEach((pair) => {
      const key = `${pair.product_id}_${pair.product_option_id}`
      const existingPPO = existingPPOMap.get(key)!
      const existingValueIds = new Set(
        (existingPPO.values ?? []).map((value) => value.id)
      )

      Array.from(new Set(pair.add ?? [])).forEach((valueId) => {
        if (existingValueIds.has(valueId)) {
          return
        }

        ppovToCreate.push({
          product_product_option_id: existingPPO.id,
          product_option_value_id: valueId,
        })
      })

      Array.from(new Set(pair.remove ?? [])).forEach((valueId) => {
        ppovToDelete.push({
          product_product_option_id: existingPPO.id,
          product_option_value_id: valueId,
        })
      })
    })

    if (ppovToDelete.length) {
      await this.productProductOptionValueService_.delete(
        ppovToDelete,
        sharedContext
      )
    }

    if (ppovToCreate.length) {
      await this.productProductOptionValueService_.create(
        ppovToCreate,
        sharedContext
      )
    }
  }

  protected async normalizeProductOptionValueUpdates_(
    updates: ProductTypes.ProductOptionProductValueUpdate[],
    sharedContext: Context
  ): Promise<
    Array<
      Omit<ProductTypes.ProductOptionProductValueUpdate, "add"> & {
        add?: string[]
      }
    >
  > {
    const valueNamesByOptionId = new Map<string, Set<string>>()
    const existingAddIdsByIndex: Array<Set<string>> = []
    const valueNamesByIndex: Array<Set<string>> = []

    updates.forEach((pair, index) => {
      const existingAddIds = new Set<string>()
      const valueNames = new Set<string>()

      const addEntries = pair.add ?? []

      addEntries.forEach((valueEntry) => {
        if (isString(valueEntry)) {
          existingAddIds.add(valueEntry)
          return
        }

        const normalizedValue = valueEntry.value.trim()
        if (!normalizedValue) {
          return
        }

        if (!valueNamesByOptionId.has(pair.product_option_id)) {
          valueNamesByOptionId.set(pair.product_option_id, new Set())
        }

        valueNamesByOptionId.get(pair.product_option_id)!.add(normalizedValue)
        valueNames.add(normalizedValue)
      })

      existingAddIdsByIndex[index] = existingAddIds
      valueNamesByIndex[index] = valueNames
    })

    /*
     * Return early if no new values need to be created
     */

    if (!valueNamesByOptionId.size) {
      return updates.map((pair, index) => ({
        ...pair,
        add: existingAddIdsByIndex[index].size
          ? [...existingAddIdsByIndex[index]]
          : undefined,
      }))
    }

    /*
     * Create values for options for passed create objects
     */

    const optionIds = [...valueNamesByOptionId.keys()]
    const options = await this.productOptionService_.list(
      { id: optionIds },
      { relations: ["values"] },
      sharedContext
    )

    if (options.length !== optionIds.length) {
      const existingIds = new Set(options.map((option) => option.id))
      const missingId = optionIds.find((id) => !existingIds.has(id))

      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot find product option with id: ${missingId}`
      )
    }

    const optionsById = new Map(options.map((option) => [option.id, option]))
    const updateOptionsInput: UpdateProductOptionInput[] = []

    valueNamesByOptionId.forEach((valueNames, optionId) => {
      const option = optionsById.get(optionId)
      if (!option) {
        return
      }

      const existingValueNames = new Set(
        option.values?.map((value) => value.value) ?? []
      )
      const newValueNames = [...valueNames].filter(
        (value) => !existingValueNames.has(value)
      )

      if (!newValueNames.length) {
        return
      }

      updateOptionsInput.push({
        id: optionId,
        values: [...existingValueNames, ...newValueNames],
      })
    })

    if (updateOptionsInput.length) {
      // todo: we could consider just `upsert` here but `updateOptions` handles validation and rank
      const updatedOptions = await this.updateOptions_(
        updateOptionsInput,
        sharedContext
      )

      updatedOptions.forEach((option) => optionsById.set(option.id, option))
    }

    const valueIdsByOptionId = new Map<string, Map<string, string>>(
      [...optionsById.values()].map((option) => [
        option.id,
        new Map(option.values?.map((value) => [value.value, value.id]) ?? []),
      ])
    )

    return updates.map((pair, index) => {
      const addIds = new Set(existingAddIdsByIndex[index])
      const valueMap = valueIdsByOptionId.get(pair.product_option_id)
      const valueNames = valueNamesByIndex[index] ?? new Set()

      valueNames.forEach((valueName) => {
        const resolvedId = valueMap?.get(valueName)
        if (resolvedId) {
          addIds.add(resolvedId)
        }
      })

      return {
        ...pair,
        add: addIds.size ? [...addIds] : undefined,
      }
    })
  }

  // @ts-expect-error
  createProductCollections(
    data: ProductTypes.CreateProductCollectionDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>
  // @ts-expect-error
  createProductCollections(
    data: ProductTypes.CreateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    return Array.isArray(data) ? createdCollections : createdCollections[0]
  }

  @InjectTransactionManager()
  async createCollections_(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCollection>[]> {
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

  @InjectManager()
  @EmitEvents()
  async upsertProductCollections(
    data:
      | ProductTypes.UpsertProductCollectionDTO[]
      | ProductTypes.UpsertProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCollectionDTO[] | ProductTypes.ProductCollectionDTO
  > {
    const collections = await this.upsertCollections_(data, sharedContext)

    const serializedCollections = await this.baseRepository_.serialize<
      ProductTypes.ProductCollectionDTO[]
    >(collections)

    return Array.isArray(data)
      ? serializedCollections
      : serializedCollections[0]
  }

  @InjectTransactionManager()
  protected async upsertCollections_(
    data:
      | ProductTypes.UpsertProductCollectionDTO[]
      | ProductTypes.UpsertProductCollectionDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCollection>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (collection): collection is UpdateCollectionInput => !!collection.id
    )
    const forCreate = input.filter(
      (collection): collection is ProductTypes.CreateProductCollectionDTO =>
        !collection.id
    )

    let created: InferEntityType<typeof ProductCollection>[] = []
    let updated: InferEntityType<typeof ProductCollection>[] = []

    if (forCreate.length) {
      created = await this.createCollections_(forCreate, sharedContext)
    }

    if (forUpdate.length) {
      updated = await this.updateCollections_(forUpdate, sharedContext)
    }

    return [...created, ...updated]
  }

  // @ts-expect-error
  updateProductCollections(
    id: string,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO>
  // @ts-expect-error
  updateProductCollections(
    selector: ProductTypes.FilterableProductCollectionProps,
    data: ProductTypes.UpdateProductCollectionDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    return isString(idOrSelector) ? updatedCollections[0] : updatedCollections
  }

  @InjectTransactionManager()
  protected async updateCollections_(
    data: UpdateCollectionInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCollection>[]> {
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

    const collections: InferEntityType<typeof ProductCollection>[] = []
    const toUpdate: {
      selector: ProductTypes.FilterableProductProps
      data: ProductTypes.UpdateProductDTO
    }[] = []

    updatedCollections.forEach((collectionData) => {
      const input = normalizedInput.find((c) => c.id === collectionData.id)
      const productsToUpdate = (input as any)?.products

      const dissociateSelector = {
        collection_id: collectionData.id,
      }
      const associateSelector = {}

      if (isDefined(productsToUpdate)) {
        const productIds = productsToUpdate.map((p) => p.id)

        dissociateSelector["id"] = { $nin: productIds }
        associateSelector["id"] = { $in: productIds }
      }

      if (isPresent(dissociateSelector["id"])) {
        toUpdate.push({
          selector: dissociateSelector,
          data: {
            collection_id: null,
          },
        })
      }

      if (isPresent(associateSelector["id"])) {
        toUpdate.push({
          selector: associateSelector,
          data: {
            collection_id: collectionData.id,
          },
        })
      }

      collections.push({
        ...collectionData,
        products: productsToUpdate ?? [],
      } as InferEntityType<typeof ProductCollection>)
    })

    if (toUpdate.length) {
      await this.productService_.update(toUpdate, sharedContext)
    }

    return collections
  }

  // @ts-expect-error
  createProductCategories(
    data: ProductTypes.CreateProductCategoryDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]>
  // @ts-expect-error
  createProductCategories(
    data: ProductTypes.CreateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createProductCategories(
    data:
      | ProductTypes.CreateProductCategoryDTO[]
      | ProductTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO[] | ProductTypes.ProductCategoryDTO
  > {
    const input = (Array.isArray(data) ? data : [data]).map(
      (productCategory) => {
        productCategory.handle ??= kebabCase(productCategory.name)
        return productCategory
      }
    )

    const categories = await this.productCategoryService_.create(
      input,
      sharedContext
    )

    const createdCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(categories)

    // TODO: Same as the update categories, for some reason I cant get the tree repository update
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

  @InjectManager()
  @EmitEvents()
  async upsertProductCategories(
    data:
      | ProductTypes.UpsertProductCategoryDTO[]
      | ProductTypes.UpsertProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO[] | ProductTypes.ProductCategoryDTO
  > {
    const categories = await this.upsertProductCategories_(data, sharedContext)

    const serializedCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(categories)

    return Array.isArray(data) ? serializedCategories : serializedCategories[0]
  }

  @InjectTransactionManager()
  protected async upsertProductCategories_(
    data:
      | ProductTypes.UpsertProductCategoryDTO[]
      | ProductTypes.UpsertProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (category): category is UpdateCategoryInput => !!category.id
    )
    let forCreate = input.filter(
      (category): category is ProductTypes.CreateProductCategoryDTO =>
        !category.id
    )

    let created: InferEntityType<typeof ProductCategory>[] = []
    let updated: InferEntityType<typeof ProductCategory>[] = []

    if (forCreate.length) {
      forCreate = forCreate.map((productCategory) => {
        productCategory.handle ??= kebabCase(productCategory.name)
        return productCategory
      })

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

    // TODO: Same as the update categories, for some reason I cant get the tree repository update
    // event. I ll need to investigate this
    if (created.length) {
      eventBuilders.createdProductCategory({
        data: created,
        sharedContext,
      })
    }
    if (updated.length) {
      eventBuilders.updatedProductCategory({
        data: updated,
        sharedContext,
      })
    }

    return [...created, ...updated]
  }

  // @ts-expect-error
  updateProductCategories(
    id: string,
    data: ProductTypes.UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO>
  // @ts-expect-error
  updateProductCategories(
    selector: ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductCategoryDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateProductCategories(
    idOrSelector: string | ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductCategoryDTO | ProductTypes.ProductCategoryDTO[]
  > {
    const categories = await this.updateProductCategories_(
      idOrSelector,
      data,
      sharedContext
    )

    const serializedCategories = await this.baseRepository_.serialize<
      ProductTypes.ProductCategoryDTO[]
    >(categories)

    // TODO: for some reason I cant get the tree repository update
    // event. I ll need to investigate this
    eventBuilders.updatedProductCategory({
      data: serializedCategories,
      sharedContext,
    })

    return isString(idOrSelector)
      ? serializedCategories[0]
      : serializedCategories
  }

  @InjectTransactionManager()
  protected async updateProductCategories_(
    idOrSelector: string | ProductTypes.FilterableProductTypeProps,
    data: ProductTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductCategory>[]> {
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

    return categories
  }

  //@ts-expect-error
  createProducts(
    data: ProductTypes.CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>
  // @ts-expect-error
  createProducts(
    data: ProductTypes.CreateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createProducts(
    data: ProductTypes.CreateProductDTO[] | ProductTypes.CreateProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    const input = Array.isArray(data) ? data : [data]
    const products = await this.createProducts_(input, sharedContext)

    const createdProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products)

    await this.filterOptionValues(createdProducts, sharedContext)

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

  @InjectTransactionManager()
  @EmitEvents()
  async upsertProducts(
    data: ProductTypes.UpsertProductDTO[] | ProductTypes.UpsertProductDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[] | ProductTypes.ProductDTO> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (product): product is UpdateProductInput => !!product.id
    )
    const forCreate = input.filter((product) => !product.id)

    let created: ProductTypes.ProductDTO[] = []
    let updated: InferEntityType<typeof Product>[] = []

    if (forCreate.length) {
      created = await this.createProducts(
        forCreate as ProductTypes.CreateProductDTO[],
        sharedContext
      )
    }
    if (forUpdate.length) {
      updated = await this.updateProducts_(forUpdate, sharedContext)
    }

    const result = [...created, ...updated]
    const allProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[] | ProductTypes.ProductDTO
    >(result)

    return Array.isArray(data) ? allProducts : allProducts[0]
  }

  // @ts-expect-error
  updateProducts(
    id: string,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO>
  // @ts-expect-error
  updateProducts(
    selector: ProductTypes.FilterableProductProps,
    data: ProductTypes.UpdateProductDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    await this.filterOptionValues(updatedProducts, sharedContext)

    return isString(idOrSelector) ? updatedProducts[0] : updatedProducts
  }

  @InjectTransactionManager()
  protected async createProducts_(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Product>[]> {
    const existingOptionIds = data
      .flatMap((p) => p.options ?? [])
      .filter((o) => "id" in o)
      .map((o) => o.id)

    let existingOptions: InferEntityType<typeof ProductOption>[] = []
    if (existingOptionIds.length > 0) {
      existingOptions = await this.productOptionService_.list(
        { id: existingOptionIds },
        { relations: ["values"] },
        sharedContext
      )

      const fetchedIds = new Set(existingOptions.map((opt) => opt.id))
      const missingIds = existingOptionIds.filter((id) => !fetchedIds.has(id))
      if (missingIds.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Some product options were not found: [${missingIds.join(", ")}]`
        )
      }
    }

    const existingOptionsMap = new Map(
      existingOptions.map((opt) => [opt.id, opt])
    )

    const hydratedData = data.map((product) => {
      if (!product.options?.length) return product

      const hydratedOptions = product.options.map((option) => {
        if ("id" in option) {
          // options guaranteed to be in the map since we throw if any are missing above
          const dbOption = existingOptionsMap.get(option.id)!

          // Preserve the value id alongside the value name so downstream
          // normalization can enforce the per-product `value_ids` subset.
          return {
            id: dbOption.id,
            title: dbOption.title,
            values: dbOption.values?.map((v) => ({ id: v.id, value: v.value })),
            value_ids: option.value_ids,
          }
        }
        return option
      })

      return { ...product, options: hydratedOptions }
    })

    const normalizedProducts = (await this.normalizeCreateProductInput(
      hydratedData,
      sharedContext
    )) as ProductTypes.CreateProductDTO[]

    for (const product of normalizedProducts) {
      this.validateProductCreatePayload(product)
    }

    const tagIds = normalizedProducts
      .flatMap((d) => (d as any).tags ?? [])
      .map((t) => t.id)
    let existingTags: InferEntityType<typeof ProductTag>[] = []

    if (tagIds.length) {
      existingTags = await this.productTagService_.list(
        {
          id: tagIds,
        },
        {},
        sharedContext
      )
    }

    const existingTagsMap = new Map(existingTags.map((tag) => [tag.id, tag]))

    const productOptionsToCreate = new Map<
      string,
      ProductTypes.CreateProductOptionDTO[]
    >()

    const productIdHydratedData = new Map<string, (typeof hydratedData)[number]>()
    const productsToCreate = normalizedProducts.map((product, index) => {
      const productId = generateEntityId(product.id, "prod")
      product.id = productId
      productIdHydratedData.set(productId, hydratedData[index])

      if ((product as any).categories?.length) {
        ;(product as any).categories = (product as any).categories.map(
          (category: { id: string }) => category.id
        )
      }

      if (product.options?.length) {
        const newOptions = product.options.filter(
          (o) => !("id" in o)
        ) as CreateProductOptionDTO[]
        if (newOptions.length) {
          productOptionsToCreate.set(productId, newOptions)
        }
      }

      if (product.variants?.length) {
        const normalizedVariants = product.variants.map((variant) => {
          const variantId = generateEntityId((variant as any).id, "variant")
          ;(variant as any).id = variantId

          Object.entries(variant.options ?? {}).forEach(([key, value]) => {
            const productOption = product.options?.find(
              (option) => (option as any).title === key
            )!
            // Respect the per-product value subset on the input: if the option
            // was linked with `value_ids`, only those values are allowed for
            // this product's variants.
            const allowedValueIds = Array.isArray(
              (productOption as any)?.value_ids
            )
              ? new Set<string>((productOption as any).value_ids as string[])
              : undefined
            const allValues = (productOption as any).values
            // Values may be wrapped a second time by normalizeCreateProductInput
            // (e.g. {value: {id, value: "red"}}). Read both shapes.
            const productOptionValue = resolveAllowedOptionValues({
              optionTitle: key,
              value,
              optionValues: allValues,
              allowedValueIds,
            })
            ;(productOptionValue as any).variants ??= []
            ;(productOptionValue as any).variants.push(variant)
          })

          delete variant.options

          return variant
        })

        product.variants = normalizedVariants
      }

      if ((product as any).tags?.length) {
        ;(product as any).tags = (product as any).tags.map(
          (tag: { id: string }) => {
            const existingTag = existingTagsMap.get(tag.id)
            if (existingTag) {
              return existingTag
            }

            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Tag with id ${tag.id} not found. Please create the tag before associating it with the product.`
            )
          }
        )
      }

      delete product.options

      return product
    })

    const productToOptionIdsMap = new Map<string, string[]>()
    const allOptionsWithIds: (ProductTypes.CreateProductOptionDTO & {
      id: string
    })[] = []

    for (const [productId, options] of productOptionsToCreate.entries()) {
      const optionIds: string[] = []

      for (const option of options) {
        const optionId = generateEntityId(undefined, "opt")
        optionIds.push(optionId)
        allOptionsWithIds.push({
          ...option,
          id: optionId,
        })
      }

      productToOptionIdsMap.set(productId, optionIds)
    }

    const [createdProducts] = await Promise.all([
      this.productService_.create(productsToCreate, sharedContext),
      allOptionsWithIds.length > 0
        ? this.createOptions_(allOptionsWithIds, sharedContext)
        : Promise.resolve([]),
    ])

    const linkPairs: ProductTypes.ProductOptionProductPair[] = []
    for (const product of createdProducts) {
      const hydratedProduct = productIdHydratedData.get(product.id)
      const existingOptions: { id: string; value_ids?: string[] }[] = []

      if (hydratedProduct?.options?.length) {
        for (const option of hydratedProduct.options) {
          if ("id" in option) {
            existingOptions.push({
              id: option.id,
              value_ids: option.value_ids,
            })
          }
        }
      }

      const newOptionIds = productToOptionIdsMap.get(product.id) ?? []
      const newOptions = newOptionIds.map((id) => ({ id }))
      const allOptions = [...existingOptions, ...newOptions]

      for (const option of allOptions) {
        const pair: ProductTypes.ProductOptionProductPair = {
          product_id: product.id,
          product_option_id: option.id,
          product_option_value_ids: (option as any).value_ids
            ? (option as any).value_ids
            : undefined,
        }

        linkPairs.push(pair)
      }
    }

    if (linkPairs.length > 0) {
      // Flush the just-created options + values to the DB before
      // addProductOptionToProduct_ runs — it reads option values via raw knex
      // to build the value-pivot rows, and that read can't see entities that
      // are still only in MikroORM's Unit of Work.
      if (allOptionsWithIds.length > 0) {
        await (sharedContext.transactionManager as any).flush()
      }
      await this.addProductOptionToProduct_(linkPairs, sharedContext)
    }

    await (sharedContext.transactionManager as any).flush()

    const productIds = createdProducts.map((p) => p.id)
    // Use the split-populate helper to avoid the MikroORM combined-populate
    // slow path
    const productsWithOptions =
      await this.productRepository_.findByIdsWithSplitPopulate(
        productIds,
        ["options", "options.values", "variants", "images", "tags"],
        sharedContext
      )

    const productIdOrder = new Map(productIds.map((id, index) => [id, index]))

    const orderedProductsWithOptions = [...productsWithOptions].sort(
      (a, b) =>
        (productIdOrder.get(a.id) ?? 0) - (productIdOrder.get(b.id) ?? 0)
    )

    return orderedProductsWithOptions
  }

  @InjectTransactionManager()
  protected async updateProducts_(
    data: UpdateProductInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Product>[]> {
    // We have to do that manually because this method is bypassing the product service and goes
    // directly to the custom product repository
    const manager = (sharedContext.transactionManager ??
      sharedContext.manager) as EntityManager
    const subscriber = createMedusaMikroOrmEventSubscriber(
      ["updateProducts_"],
      this as unknown as ReturnType<typeof MedusaService<any>>
    )

    if (manager && subscriber) {
      manager
        .getEventManager()
        .registerSubscriber(new subscriber(sharedContext))
    }

    const allOptionIds = data
      .flatMap((p) => p.option_ids ?? [])
      .filter((id) => !!id)

    const [originalProducts, existingOptions] = await promiseAll([
      this.productService_.list(
        { id: data.map((d) => d.id) },
        {
          relations: ["options", "options.values", "tags"],
        },
        sharedContext
      ),
      allOptionIds.length
        ? this.productOptionService_.list(
            { id: allOptionIds },
            {},
            sharedContext
          )
        : Promise.resolve([]),
    ])

    if (allOptionIds.length && existingOptions.length !== allOptionIds.length) {
      const found = new Set(existingOptions.map((opt) => opt.id))
      const missing = allOptionIds.filter((id) => !found.has(id))
      if (missing.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Some product options were not found: [${missing.join(", ")}]`
        )
      }
    }

    const { linkPairs, unlinkPairs, expectedOptionIdsMap } =
      computeOptionLinkChanges(data, originalProducts)

    for (const product of data) {
      delete product.option_ids
    }

    if (linkPairs.length) {
      await this.addProductOptionToProduct_(linkPairs, sharedContext)
    }

    await (sharedContext.transactionManager as any).flush()

    const normalizedProducts = (await this.normalizeUpdateProductInput(
      data
    )) as UpdateProductInput[]

    for (const product of normalizedProducts) {
      this.validateProductUpdatePayload(product)
    }

    // Load the per-product allowed value subset *after* the link flush so the
    // map reflects the just-created pivot rows. deepUpdate uses this to enforce
    // that variant.options only reference values inside the subset.
    const valueIdsByProductId =
      await this.productRepository_.getOptionValueIdsByProductIds(
        normalizedProducts.map((p) => p.id),
        sharedContext
      )

    const updatedProducts = await this.productRepository_.deepUpdate(
      normalizedProducts,
      ProductModuleService.validateVariantOptions,
      expectedOptionIdsMap,
      valueIdsByProductId,
      sharedContext
    )

    if (unlinkPairs.length) {
      const alreadyValidatedProductIds = new Set(expectedOptionIdsMap.keys())
      await this.removeProductOptionFromProduct_(
        unlinkPairs,
        alreadyValidatedProductIds,
        sharedContext
      )
    }

    return updatedProducts
  }

  // @ts-expect-error
  updateProductOptionValues(
    idOrSelector: string,
    data: ProductTypes.UpdateProductOptionValueDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionValueDTO>
  // @ts-expect-error
  updateProductOptionValues(
    selector: FilterableProductOptionValueProps,
    data: ProductTypes.UpdateProductOptionValueDTO,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductOptionValueDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateProductOptionValues(
    idOrSelector: string | FilterableProductOptionValueProps,
    data: ProductTypes.UpdateProductOptionValueDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    ProductTypes.ProductOptionValueDTO | ProductTypes.ProductOptionValueDTO[]
  > {
    // TODO: There is a mismatch in the API which lead to function with different number of
    // arguments. Therefore, applying the MedusaContext() decorator to the function will not work
    // because the context arg index will differ from method to method.
    sharedContext.messageAggregator ??= new MessageAggregator()

    let normalizedInput: ({
      id: string
    } & ProductTypes.UpdateProductOptionValueDTO)[] = []
    if (isString(idOrSelector)) {
      // This will throw if the product option value does not exist
      await this.productOptionValueService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const productOptionValues = await this.productOptionValueService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = productOptionValues.map((product) => ({
        id: product.id,
        ...data,
      }))
    }

    const productOptionValues = await this.updateProductOptionValues_(
      normalizedInput,
      sharedContext
    )

    const updatedProductOptionValues = await this.baseRepository_.serialize<
      ProductTypes.ProductOptionValueDTO[]
    >(productOptionValues)

    // TODO: Because of the wrong method override, we have to compensate to prevent breaking
    // changes right now
    const groupedEvents = sharedContext.messageAggregator!.getMessages()
    if (
      Object.values(groupedEvents).flat().length > 0 &&
      this.eventBusModuleService_
    ) {
      const promises: Promise<void>[] = []
      for (const group of Object.keys(groupedEvents)) {
        promises.push(
          this.eventBusModuleService_!.emit(groupedEvents[group], {
            internal: true,
          })
        )
      }

      await Promise.all(promises)

      sharedContext.messageAggregator.clearMessages()
    }

    return isString(idOrSelector)
      ? updatedProductOptionValues[0]
      : updatedProductOptionValues
  }

  @InjectTransactionManager()
  protected async updateProductOptionValues_(
    normalizedInput: ({
      id: string
    } & ProductTypes.UpdateProductOptionValueDTO)[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof ProductOptionValue>[]> {
    return await this.productOptionValueService_.update(
      normalizedInput,
      sharedContext
    )
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
        `Invalid product handle '${productData.handle}'. It must contain URL safe characters`
      )
    }
  }

  protected validateProductCreatePayload(
    productData: ProductTypes.CreateProductDTO
  ) {
    this.validateProductPayload(productData)

    if (!productData.title) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product title is required`
      )
    }

    const options = productData.options

    if (options?.length) {
      const seenOptionIds = new Set<string>()
      const duplicateOptionIds: string[] = []
      for (const option of options) {
        if ("id" in option) {
          if (seenOptionIds.has(option.id)) {
            duplicateOptionIds.push(option.id)
          } else {
            seenOptionIds.add(option.id)
          }
        }
      }
      if (duplicateOptionIds.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product "${productData.title}" has duplicate option assignments: [${duplicateOptionIds.join(", ")}]`
        )
      }
    }

    const missingOptionsVariants: string[] = []

    if (options?.length) {
      productData.variants?.forEach((variant) => {
        options.forEach((option) => {
          if (!variant.options?.[(option as any).title]) {
            missingOptionsVariants.push(variant.title)
          }
        })
      })
    }

    if (missingOptionsVariants.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product "${
          productData.title
        }" has variants with missing options: [${missingOptionsVariants.join(
          ", "
        )}]`
      )
    }
  }

  protected validateProductUpdatePayload(productData: UpdateProductInput) {
    this.validateProductPayload(productData)
  }

  protected async normalizeCreateProductInput<
    T extends ProductTypes.CreateProductDTO | ProductTypes.CreateProductDTO[],
    TOutput = T extends ProductTypes.CreateProductDTO[]
      ? ProductTypes.CreateProductDTO[]
      : ProductTypes.CreateProductDTO
  >(
    products: T,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TOutput> {
    const products_ = Array.isArray(products) ? products : [products]

    const normalizedProducts = (await this.normalizeUpdateProductInput(
      products_ as UpdateProductInput[]
    )) as ProductTypes.CreateProductDTO[]

    for await (const productData of normalizedProducts) {
      if (productData.options?.length) {
        ;(productData as any).options = productData.options?.map((option) => {
          return {
            title: (option as any).title,
            values: (option as any).values?.map((value) => {
              return {
                value: value,
              }
            }),
            is_exclusive: (option as any).is_exclusive ?? true, // Always default to true for options created from product creation
            ...((option as any).id ? { id: (option as any).id } : {}),
            // Preserve the per-product value subset so downstream variant
            // normalization can enforce it.
            ...((option as any).value_ids
              ? { value_ids: (option as any).value_ids }
              : {}),
          }
        })
      }

      if (!productData.handle && productData.title) {
        productData.handle = toHandle(productData.title)
      }

      if (!productData.status) {
        productData.status = ProductStatus.DRAFT
      }

      if (!productData.thumbnail && productData.images?.length) {
        productData.thumbnail = productData.images[0].url
      }

      if (productData.images?.length) {
        productData.images = productData.images.map((image, index) =>
          (image as { rank?: number }).rank != null
            ? image
            : {
                ...image,
                rank: index,
              }
        )
      }
    }

    return (
      Array.isArray(products) ? normalizedProducts : normalizedProducts[0]
    ) as TOutput
  }

  /**
   * Normalizes the input for the update product input
   * @param products - The products to normalize
   * @param originalProducts - The original products to use for the normalization (must include options and option values relations)
   * @returns The normalized products
   */
  protected async normalizeUpdateProductInput<
    T extends UpdateProductInput | UpdateProductInput[],
    TOutput = T extends UpdateProductInput[]
      ? UpdateProductInput[]
      : UpdateProductInput
  >(
    products: T,
    originalProducts?: InferEntityType<typeof Product>[]
  ): Promise<TOutput> {
    const products_ = Array.isArray(products) ? products : [products]

    const normalizedProducts: UpdateProductInput[] = []

    for (const product of products_) {
      const productData = { ...product }
      if (productData.is_giftcard) {
        productData.discountable = false
      }

      if (productData.tag_ids) {
        ;(productData as any).tags = productData.tag_ids.map((cid) => ({
          id: cid,
        }))
        delete productData.tag_ids
      }

      if (productData.category_ids) {
        ;(productData as any).categories = productData.category_ids.map(
          (cid) => ({
            id: cid,
          })
        )
        delete productData.category_ids
      }

      normalizedProducts.push(productData)
    }

    return (
      Array.isArray(products) ? normalizedProducts : normalizedProducts[0]
    ) as TOutput
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
    if (Array.isArray(collectionData.product_ids)) {
      ;(collectionData as any).products = collectionData.product_ids.map(
        (pid) => ({ id: pid })
      )

      delete collectionData.product_ids
    }

    return collectionData
  }

  protected static validateVariantOptions(
    variants:
      | ProductTypes.CreateProductVariantDTO[]
      | ProductTypes.UpdateProductVariantDTO[],
    options: InferEntityType<typeof ProductOption>[],
    productId: string,
    allowedValueIds?: Set<string>
  ) {
    const optionsByProductId = new Map([[productId, options]])
    const valueIdsByProductId = allowedValueIds
      ? new Map([[productId, allowedValueIds]])
      : undefined
    const variantsWithOptions = ProductModuleService.assignOptionsToVariants(
      variants.map((v) => ({ ...v, product_id: productId })),
      optionsByProductId,
      valueIdsByProductId
    )

    ProductModuleService.checkIfVariantsHaveUniqueOptionsCombinations(
      variantsWithOptions as any
    )
  }

  protected static assignOptionsToVariants(
    variants:
      | ProductTypes.CreateProductVariantDTO[]
      | ProductTypes.UpdateProductVariantDTO[],
    optionsByProductId: Map<string, InferEntityType<typeof ProductOption>[]>,
    // When provided, each product's allowed option-value subset
    // (product_product_option_value pivot) is enforced — a variant cannot
    // reference a value that exists on the option but is not in the product's
    // subset. Without it, the helper falls back to using the option's full
    // value list, which is the legacy (1:1 product↔option) behavior.
    valueIdsByProductId?: Map<string, Set<string>>
  ):
    | ProductTypes.CreateProductVariantDTO[]
    | ProductTypes.UpdateProductVariantDTO[] {
    if (!variants.length) {
      return variants
    }
    const variantsWithOptions = variants.map((variant: any) => {
      const numOfProvidedVariantOptionValues = Object.keys(
        variant.options || {}
      ).length

      const productsOptions =
        optionsByProductId.get(variant.product_id) ?? []
      const allowedValueIds = valueIdsByProductId?.get(variant.product_id)

      if (
        numOfProvidedVariantOptionValues &&
        productsOptions.length !== numOfProvidedVariantOptionValues
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product has ${productsOptions.length} option values but there were ${numOfProvidedVariantOptionValues} provided option values for the variant: ${variant.title}.`
        )
      }

      const variantOptions = Object.entries(variant.options || {}).map(
        ([key, val]) => {
          const option = productsOptions.find((o) => o.title === key)
          const optionValue = resolveAllowedOptionValues({
            optionTitle: key,
            value: val,
            optionValues: option?.values,
            allowedValueIds,
          })

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

  /**
   * Validate that `data` doesn't create or update a variant to have same options combination
   * as an existing variant on the product.
   * @param data - create / update payloads
   * @param variants - existing variants
   * @protected
   */
  protected static checkIfVariantWithOptionsAlreadyExists(
    data: ((
      | ProductTypes.CreateProductVariantDTO
      | UpdateProductVariantInput
    ) & { options: { id: string }[]; product_id: string })[],
    variants: InferEntityType<typeof ProductVariant>[]
  ) {
    for (const variantData of data) {
      const existingVariant = variants.find((v) => {
        if (
          variantData.product_id! !== v.product_id ||
          !variantData.options?.length
        ) {
          return false
        }

        if ((variantData as UpdateProductVariantInput)?.id === v.id) {
          return false
        }

        return (variantData.options as unknown as { id: string }[])!.every(
          (optionValue) => {
            const variantOptionValue = v.options.find(
              (vo) => vo.id === optionValue.id
            )
            return !!variantOptionValue
          }
        )
      })

      if (existingVariant) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Variant (${existingVariant.title}) with provided options already exists.`
        )
      }
    }
  }

  /**
   * Validate that array of variants that we are upserting doesn't have variants with the same options.
   * @param variants -
   * @protected
   */
  protected static checkIfVariantsHaveUniqueOptionsCombinations(
    variants: (ProductTypes.UpdateProductVariantDTO & {
      options: { id: string }[]
    })[]
  ) {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      for (let j = i + 1; j < variants.length; j++) {
        const compareVariant = variants[j]

        const exists = variant.options?.every(
          (optionValue) =>
            !!compareVariant.options.find(
              (compareOptionValue) => compareOptionValue.id === optionValue.id
            )
        )

        if (exists) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Variant "${variant.title}" has same combination of option values as "${compareVariant.title}".`
          )
        }
      }
    }
  }

  @InjectManager()
  // @ts-ignore
  async listProductVariants(
    filters?: ProductTypes.FilterableProductVariantProps,
    config?: FindConfig<ProductTypes.ProductVariantDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const shouldLoadImages = config?.relations?.includes("images")

    const relations = [...(config?.relations || [])]
    if (shouldLoadImages) {
      relations.push("product.images")
    }

    const variants = await this.productVariantService_.list(
      filters,
      {
        ...config,
        relations,
      },
      sharedContext
    )

    if (shouldLoadImages) {
      // Get variant images for all variants
      const variantImagesMap = await this.getVariantImages(
        variants,
        sharedContext
      )

      for (const variant of variants) {
        variant.images = variantImagesMap.get(variant.id) || []
      }
    }

    return this.baseRepository_.serialize<ProductTypes.ProductVariantDTO[]>(
      variants
    )
  }

  @InjectManager()
  // @ts-ignore
  async listAndCountProductVariants(
    filters?: ProductTypes.FilterableProductVariantProps,
    config?: FindConfig<ProductTypes.ProductVariantDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductVariantDTO[], number]> {
    const shouldLoadImages = config?.relations?.includes("images")

    const relations = [...(config?.relations || [])]
    if (shouldLoadImages) {
      relations.push("product.images")
    }

    const [variants, count] = await this.productVariantService_.listAndCount(
      filters,
      {
        ...config,
        relations,
      },
      sharedContext
    )

    if (shouldLoadImages) {
      // Get variant images for all variants
      const variantImagesMap = await this.getVariantImages(
        variants,
        sharedContext
      )

      for (const variant of variants) {
        variant.images = variantImagesMap.get(variant.id) || []
      }
    }

    const serializedVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(variants)
    return [serializedVariants, count]
  }

  @InjectManager()
  // @ts-ignore
  async retrieveProductVariant(
    id: string,
    config?: FindConfig<any>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<any> {
    const shouldLoadImages = config?.relations?.includes("images")

    const relations = [...(config?.relations || [])]
    if (shouldLoadImages) {
      relations.push("images", "product", "product.images")
    }

    const variant = await this.productVariantService_.retrieve(
      id,
      {
        ...config,
        relations,
      },
      sharedContext
    )

    if (shouldLoadImages) {
      const variantImages = await this.getVariantImages(
        [variant],
        sharedContext
      )
      variant.images = variantImages.get(id) || []
    }

    return this.baseRepository_.serialize(variant)
  }

  @InjectManager()
  async addImageToVariant(
    data: VariantImageInputArray,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ id: string }[]> {
    const productVariantProductImage = await this.addImageToVariant_(
      data,
      sharedContext
    )

    return productVariantProductImage as { id: string }[]
  }

  @InjectTransactionManager()
  protected async addImageToVariant_(
    data: VariantImageInputArray,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{ id: string } | { id: string }[]> {
    // TODO: consider validation that image and variant are on the same product

    const productVariantProductImage =
      await this.productVariantProductImageService_.create(data, sharedContext)

    return (
      productVariantProductImage as unknown as InferEntityType<
        typeof ProductVariantProductImage
      >[]
    ).map((vi) => ({ id: vi.id }))
  }

  @InjectManager()
  async removeImageFromVariant(
    data: VariantImageInputArray,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removeImageFromVariant_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async removeImageFromVariant_(
    data: VariantImageInputArray,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const pairs = Array.isArray(data) ? data : [data]
    const productVariantProductImages =
      await this.productVariantProductImageService_.list({
        $or: pairs,
      })

    await this.productVariantProductImageService_.delete(
      productVariantProductImages.map((p) => p.id as string),
      sharedContext
    )
  }

  @InjectManager()
  private async getVariantImages(
    variants: Pick<
      InferEntityType<typeof ProductVariant>,
      "id" | "product_id"
    >[],
    context: Context = {}
  ): Promise<Map<string, InferEntityType<typeof ProductImage>[]>> {
    if (variants.length === 0) {
      return new Map()
    }

    // Create lookup maps for efficient processing
    const uniqueProductIds = new Set<string>()

    // Build lookup maps
    for (const variant of variants) {
      if (variant.product_id) {
        uniqueProductIds.add(variant.product_id)
      }
    }

    const allProductImages = (await this.listProductImages(
      { product_id: Array.from(uniqueProductIds) },
      {
        relations: ["variants"],
      },
      context
    )) as (ProductTypes.ProductImageDTO & {
      product_id: string
      variants: InferEntityType<typeof ProductVariant>[]
    })[]

    // all product images
    const imagesByProductId = new Map<string, typeof allProductImages>()
    // variant specific images
    const variantSpecificImageIds = new Map<string, Set<string>>()

    // Single pass to build both lookup maps
    for (const img of allProductImages) {
      // Group by product_id
      if (!imagesByProductId.has(img.product_id)) {
        imagesByProductId.set(img.product_id, [])
      }
      imagesByProductId.get(img.product_id)!.push(img)

      // Track variant-specific images
      if (img.variants.length > 0) {
        for (const variant of img.variants) {
          if (!variantSpecificImageIds.has(variant.id)) {
            variantSpecificImageIds.set(variant.id, new Set())
          }
          variantSpecificImageIds.get(variant.id)!.add(img.id || "")
        }
      }
    }

    const result = new Map<string, InferEntityType<typeof ProductImage>[]>()

    for (const variant of variants) {
      const productId = variant.product_id!

      const productImages = imagesByProductId.get(productId) || []
      const specificImageIds =
        variantSpecificImageIds.get(variant.id) || new Set()

      const variantImages = productImages.filter((img) => {
        // general product image
        if (!img.variants.length) {
          return true
        }
        // Check if this image is specifically associated with this variant
        return specificImageIds.has(img.id || "")
      })

      result.set(
        variant.id,
        variantImages as InferEntityType<typeof ProductImage>[]
      )
    }

    return result
  }

  /*
   * Validates that no variants are using the specified option or option values
   * before they are removed from a product.
   *
   * @param pairs - Array of validation pairs: { productId, optionId, valueIdsToCheck? }
   * @param sharedContext - The shared context
   * @throws MedusaError if any variants are using the option/values
   */
  @InjectTransactionManager()
  protected async validateOptionRemoval_(
    pairs: Array<{
      productId: string
      optionId: string
      valueIdsToCheck?: string[]
    }>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    if (pairs.length === 0) {
      return
    }

    // Filter pairs that need validation (for option removal, check if option is linked)
    const pairsToValidate: Array<{
      productId: string
      optionId: string
      valueIdsToCheck?: string[]
    }> = []

    // For option removals (no valueIdsToCheck), check if options are linked to products
    const optionRemovalPairs = pairs.filter((p) => !p.valueIdsToCheck)
    if (optionRemovalPairs.length) {
      const existingProductOptions =
        await this.productProductOptionService_.list(
          {
            $or: optionRemovalPairs.map((p) => ({
              product_id: p.productId,
              product_option_id: p.optionId,
            })),
          },
          {},
          sharedContext
        )

      const existingPairsSet = new Set(
        existingProductOptions.map(
          (epo) =>
            `${(epo as any).product_id}_${(epo as any).product_option_id}`
        )
      )

      // Only validate pairs that are actually linked
      for (const pair of optionRemovalPairs) {
        const key = `${pair.productId}_${pair.optionId}`
        if (existingPairsSet.has(key)) {
          pairsToValidate.push(pair)
        }
      }
    }

    // For value removals (with valueIdsToCheck), always validate
    const valueRemovalPairs = pairs.filter((p) => p.valueIdsToCheck)
    pairsToValidate.push(...valueRemovalPairs)

    if (pairsToValidate.length === 0) {
      return // Nothing to validate
    }

    // Get all unique option IDs to fetch options with their values
    const uniqueOptionIds = [...new Set(pairsToValidate.map((p) => p.optionId))]
    const options = await this.productOptionService_.list(
      { id: uniqueOptionIds },
      { relations: ["values"] },
      sharedContext
    )

    const optionsMap = new Map(options.map((opt) => [opt.id, opt]))

    const bulkValidationPairs: Array<{
      productId: string
      optionValueIds: string[]
      pair: { productId: string; optionId: string; valueIdsToCheck?: string[] }
      option: InferEntityType<typeof ProductOption>
    }> = []

    for (const pair of pairsToValidate) {
      const option = optionsMap.get(pair.optionId)
      if (!option) {
        continue // Option doesn't exist, skip
      }

      // if no subset is provided we check the whole option values
      const valueIdsToValidate = pair.valueIdsToCheck
        ? pair.valueIdsToCheck
        : (option.values || []).map((v) => v.id)

      if (valueIdsToValidate.length === 0) {
        continue // No values to check
      }

      bulkValidationPairs.push({
        productId: pair.productId,
        optionValueIds: valueIdsToValidate,
        pair,
        option,
      })
    }

    if (bulkValidationPairs.length > 0) {
      const conflictingVariantsMap =
        await this.productRepository_.checkVariantsUsingOptionValues(
          bulkValidationPairs.map((p) => ({
            productId: p.productId,
            optionValueIds: p.optionValueIds,
          })),
          sharedContext
        )

      for (const bulkPair of bulkValidationPairs) {
        const allConflictingVariants: Array<{
          variant_id: string
          title: string | null
        }> = []

        for (const valueId of bulkPair.optionValueIds) {
          const key = `${bulkPair.productId}_${valueId}`
          const variants = conflictingVariantsMap.get(key) || []
          // Deduplicate variants by variant_id
          for (const variant of variants) {
            if (
              !allConflictingVariants.some(
                (v) => v.variant_id === variant.variant_id
              )
            ) {
              allConflictingVariants.push({
                variant_id: variant.variant_id,
                title: variant.title,
              })
            }
          }
        }

        if (allConflictingVariants.length > 0) {
          const variantNames = allConflictingVariants.map(
            (v) => v.title || v.variant_id
          )

          if (bulkPair.pair.valueIdsToCheck) {
            // Specific values being removed
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Cannot unassign option values from product because the following variant(s) are using it: ${variantNames.join(
                ", "
              )}`
            )
          } else {
            // Entire option being removed
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Cannot unassign product option from product which has variants for that option`
            )
          }
        }
      }
    }
  }

  private async filterOptionValues(
    products: FilterableProduct | FilterableProduct[],
    sharedContext: Context = {}
  ): Promise<void> {
    const productsList = Array.isArray(products) ? products : [products]

    if (!productsList.length) {
      return
    }

    const productsWithOptions = productsList.filter(
      (product) => (product.options ?? []).length > 0
    )

    if (!productsWithOptions.length) {
      return
    }

    const productIds = productsWithOptions
      .map((product) => product.id)
      .filter((id): id is string => !!id)

    if (!productIds.length) {
      return
    }

    const allowedValueIdsByProduct =
      await this.productRepository_.getOptionValueIdsByProductIds(
        productIds,
        sharedContext
      )

    for (const product of productsWithOptions) {
      const allowedValueIds =
        allowedValueIdsByProduct.get(product.id) ?? new Set<string>()

      const options = product.options ?? []

      for (const option of options) {
        const values = option.values ?? []

        option.values = values.filter((value) => allowedValueIds.has(value.id))
      }

      product.options = options
    }
  }

  /**
   * Assigns the computed `images` value to each variant of the given products:
   * every variant receives the product's general images (images not assigned
   * to any variant), and variants with specific assignments additionally
   * receive those images. This union is what `variants.images` exposes — it
   * cannot be loaded through the m:n relation, which only contains explicit
   * assignments.
   *
   * The products are expected to be serialized already. The assignment is
   * intentionally performed on plain DTOs (after serialization) so that no
   * ORM entity ever leaks into the returned payload, and the variant <> image
   * relations are fetched in a single query for all products.
   */
  private async assignImagesToVariants(
    products: {
      variants?: { id: string; images?: ProductTypes.ProductImageDTO[] }[]
      images?: ProductTypes.ProductImageDTO[]
    }[],
    sharedContext: Context = {}
  ): Promise<void> {
    const productsToProcess = products.filter(
      (product) => product.variants?.length && product.images
    )

    const variantIds = productsToProcess.flatMap((product) =>
      product.variants!.map((variant) => variant.id)
    )

    if (!variantIds.length) {
      return
    }

    const variantImageRelations =
      await this.productVariantProductImageService_.list(
        { variant_id: variantIds },
        { select: ["variant_id", "image_id"] },
        sharedContext
      )

    const variantIdImageIdsMap = new Map<string, Set<string>>()
    const imageIdsWithVariants = new Set<string>()

    // build both lookup
    for (const relation of variantImageRelations) {
      if (!variantIdImageIdsMap.has(relation.variant_id)) {
        variantIdImageIdsMap.set(relation.variant_id, new Set())
      }
      variantIdImageIdsMap.get(relation.variant_id)!.add(relation.image_id)

      imageIdsWithVariants.add(relation.image_id)
    }

    for (const product of productsToProcess) {
      const [generalImages, variantImages] = partitionArray(
        product.images!,
        (img) => !imageIdsWithVariants.has(img.id) // if image doesn't have any variants, it is a general image
      )

      for (const variant of product.variants!) {
        const variantImageIds = variantIdImageIdsMap.get(variant.id)

        variant.images = [...generalImages]

        if (!variantImageIds?.size) {
          continue
        }

        for (const image of variantImages) {
          if (variantImageIds.has(image.id)) {
            variant.images.push(image)
          }
        }
      }
    }
  }

  protected async loadOptionsAndValuesByProductId_(
    productIds: string[],
    sharedContext: Context = {}
  ): Promise<{
    optionsByProductId: Map<string, InferEntityType<typeof ProductOption>[]>
    valueIdsByProductId: Map<string, Set<string>>
  }> {
    const [productOptions, optionIdsByProductId, valueIdsByProductId] =
      await promiseAll([
        this.productOptionService_.list(
          { products: { id: productIds } },
          { relations: ["values"] },
          sharedContext
        ),
        this.productRepository_.getOptionIdsByProductIds(
          productIds,
          sharedContext
        ),
        this.productRepository_.getOptionValueIdsByProductIds(
          productIds,
          sharedContext
        ),
      ])

    const optionsById = new Map(productOptions.map((o) => [o.id, o]))
    const optionsByProductId = new Map<
      string,
      InferEntityType<typeof ProductOption>[]
    >()
    for (const [productId, optionIds] of optionIdsByProductId) {
      const opts: InferEntityType<typeof ProductOption>[] = []
      optionIds.forEach((id) => {
        const opt = optionsById.get(id)
        if (opt) {
          opts.push(opt)
        }
      })
      optionsByProductId.set(productId, opts)
    }

    return { optionsByProductId, valueIdsByProductId }
  }
}
