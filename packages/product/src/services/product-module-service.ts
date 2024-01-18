import {
  Context,
  CreateProductOnlyDTO,
  DAL,
  FindConfig,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ProductTypes,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  InjectIntoContext,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MessageAggregator,
  isDefined,
  isString,
  kebabCase,
  mapObjectTo,
  promiseAll,
} from "@medusajs/utils"
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
  ProductOptionValueService,
  ProductService,
  ProductTagService,
  ProductTypeService,
  ProductVariantService,
} from "@services"
import ProductImageService from "./product-image"

import {
  ProductCategoryServiceTypes,
  ProductServiceTypes,
  ProductVariantServiceTypes,
} from "@types"

import { arrayDifference, groupBy } from "@medusajs/utils"
import {
  CreateProductOptionValueDTO,
  UpdateProductOptionValueDTO,
} from "../types/services/product-option-value"
import {
  LinkableKeys,
  entityNameToLinkableKeysMap,
  joinerConfig,
} from "./../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService<any>
  productVariantService: ProductVariantService<any, any>
  productTagService: ProductTagService<any>
  productCategoryService: ProductCategoryService<any>
  productCollectionService: ProductCollectionService<any>
  productImageService: ProductImageService<any>
  productTypeService: ProductTypeService<any>
  productOptionService: ProductOptionService<any>
  productOptionValueService: ProductOptionValueService<any>
  eventBusModuleService?: IEventBusModuleService
}

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
> implements ProductTypes.IProductModuleService
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
  protected readonly productImageService_: ProductImageService<TProductImage>
  protected readonly productTypeService_: ProductTypeService<TProductType>
  protected readonly productOptionService_: ProductOptionService<TProductOption>
  // eslint-disable-next-line max-len
  protected readonly productOptionValueService_: ProductOptionValueService<TProductOptionValue>
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

  @InjectManager("baseRepository_")
  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.productService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(products, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async retrieve(
    productId: string,
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO> {
    const product = await this.productService_.retrieve(
      productId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(product, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductDTO[], number]> {
    const [products, count] = await this.productService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize(products, {
        populate: true,
      }),
      count,
    ]
  }

  @InjectManager("baseRepository_")
  async retrieveVariant(
    productVariantId: string,
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO> {
    const productVariant = await this.productVariantService_.retrieve(
      productVariantId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productVariant, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listVariants(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const variants = await this.productVariantService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(variants, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountVariants(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductVariantDTO[], number]> {
    const [variants, count] = await this.productVariantService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize(variants, {
        populate: true,
      }),
      count,
    ]
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

    return productVariants as unknown as ProductTypes.ProductVariantDTO[]
  }

  @InjectTransactionManager("baseRepository_")
  async deleteVariants(
    productVariantIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productVariantService_.delete(productVariantIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async updateVariants(
    data: ProductTypes.UpdateProductVariantOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const productVariants = await this.updateVariants_(data, sharedContext)

    const updatedVariants = await this.baseRepository_.serialize<
      ProductTypes.ProductVariantDTO[]
    >(productVariants, {
      populate: true,
    })

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
      | CreateProductOptionValueDTO
      | UpdateProductOptionValueDTO
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
            value: optionIdToUpdateValueMap.get(
              existingOptionValue.option.id
            )! as string,
          })
          optionIdToUpdateValueMap.delete(existingOptionValue.option.id)
        }

        for (const [option_id, value] of optionIdToUpdateValueMap.entries()) {
          optionValuesToUpsert.push({
            option_id: option_id as string,
            value: value as string,
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

    const [, , productVariants]: [
      void,
      [TProductOptionValue[], TProductOptionValue[], TProductOptionValue[]],
      TProductVariant[][]
    ] = await promiseAll([
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

  @InjectManager("baseRepository_")
  async retrieveTag(
    tagId: string,
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO> {
    const productTag = await this.productTagService_.retrieve(
      tagId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productTag, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listTags(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const tags = await this.productTagService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(tags, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountTags(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductTagDTO[], number]> {
    const [tags, count] = await this.productTagService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize(tags, { populate: true }),
      count,
    ]
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async createTags(
    data: ProductTypes.CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const productTags = await this.productTagService_.create(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productTags, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async updateTags(
    data: ProductTypes.UpdateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const productTags = await this.productTagService_.update(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productTags, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async deleteTags(
    productTagIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTagService_.delete(productTagIds, sharedContext)

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  async retrieveType(
    typeId: string,
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO> {
    const productType = await this.productTypeService_.retrieve(
      typeId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productType, { populate: true })
  }

  @InjectManager("baseRepository_")
  async listTypes(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[]> {
    const types = await this.productTypeService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(types, { populate: true })
  }

  @InjectManager("baseRepository_")
  async listAndCountTypes(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductTypeDTO[], number]> {
    const [types, count] = await this.productTypeService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize(types, { populate: true }),
      count,
    ]
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async createTypes(
    data: ProductTypes.CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[]> {
    const productTypes = await this.productTypeService_.create(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productTypes, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async updateTypes(
    data: ProductTypes.UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductTypeDTO[]> {
    const productTypes = await this.productTypeService_.update(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productTypes, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async deleteTypes(
    productTypeIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTypeService_.delete(productTypeIds, sharedContext)

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  async retrieveOption(
    optionId: string,
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO> {
    const productOptions = await this.productOptionService_.retrieve(
      optionId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productOptions, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listOptions(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductOptionDTO[]> {
    const productOptions = await this.productOptionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productOptions, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountOptions(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductOptionDTO[], number]> {
    const [productOptions, count] =
      await this.productOptionService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize(productOptions, { populate: true }),
      count,
    ]
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async createOptions(
    data: ProductTypes.CreateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productOptions = await this.productOptionService_.create(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(productOptions, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async updateOptions(
    data: ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productOptions = await this.productOptionService_.update(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize<
      ProductTypes.ProductOptionDTO[]
    >(productOptions, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async deleteOptions(
    productOptionIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productOptionService_.delete(productOptionIds, sharedContext)

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  async retrieveCollection(
    productCollectionId: string,
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCollectionDTO> {
    const productCollection = await this.productCollectionService_.retrieve(
      productCollectionId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(productCollection, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listCollections(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCollectionDTO[]> {
    const collections = await this.productCollectionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(collections, { populate: true })
  }

  @InjectManager("baseRepository_")
  async listAndCountCollections(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductCollectionDTO[], number]> {
    const collections = await this.productCollectionService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(collections))
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async createCollections(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCollectionDTO[]> {
    const productCollections = await this.productCollectionService_.create(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productCollections, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async updateCollections(
    data: ProductTypes.UpdateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCollectionDTO[]> {
    const productCollections = await this.productCollectionService_.update(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return await this.baseRepository_.serialize(productCollections, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async deleteCollections(
    productCollectionIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCollectionService_.delete(
      productCollectionIds,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  async retrieveCategory(
    productCategoryId: string,
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCategoryDTO> {
    const productCategory = await this.productCategoryService_.retrieve(
      productCategoryId,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productCategory))
  }

  @InjectManager("baseRepository_")
  async listCategories(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductCategoryDTO[]> {
    const categories = await this.productCategoryService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async createCategory(
    data: ProductCategoryServiceTypes.CreateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productCategory = await this.productCategoryService_.create(
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return JSON.parse(JSON.stringify(productCategory))
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async updateCategory(
    categoryId: string,
    data: ProductCategoryServiceTypes.UpdateProductCategoryDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productCategory = await this.productCategoryService_.update(
      categoryId,
      data,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return JSON.parse(JSON.stringify(productCategory))
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async deleteCategory(
    categoryId: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCategoryService_.delete(categoryId, sharedContext)

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  async listAndCountCategories(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[ProductTypes.ProductCategoryDTO[], number]> {
    const categories = await this.productCategoryService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }

  @InjectManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async create(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.create_(data, sharedContext)
    const createdProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products, {
      populate: true,
    })

    await this.emitEvents_(
      sharedContext?.messageAggregator?.getMessages({
        groupBy: ["eventName", "body.metadata.object"],
      })
    )

    return createdProducts
  }

  @InjectManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async update(
    data: ProductTypes.UpdateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.update_(data, sharedContext)

    const updatedProducts = await this.baseRepository_.serialize<
      ProductTypes.ProductDTO[]
    >(products, {
      populate: true,
    })

    await this.emitEvents_(
      sharedContext.messageAggregator?.getMessages({
        groupBy: ["eventName", "body.metadata.object"],
      })
    )

    return updatedProducts
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    const messageAggregator = new MessageAggregator()
    sharedContext.messageAggregator = messageAggregator

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

    return products
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: ProductTypes.UpdateProductDTO[],
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
      (
        | ProductTypes.CreateProductVariantDTO
        | ProductTypes.UpdateProductVariantDTO
      )[]
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

        return productData as ProductServiceTypes.UpdateProductDTO
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
      const [options] = await this.productOptionService_.upsert(
        productData.options,
        sharedContext
      )

      productData.options = options
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
      const [images] = await this.productImageService_.upsert(
        productData.images.map((image) => {
          if (isString(image)) {
            return image
          } else {
            return image.url
          }
        }),
        sharedContext
      )

      productData.images = images
    }
  }

  protected async upsertAndAssignProductTagsToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (productData.tags?.length) {
      const [tags] = await this.productTagService_.upsert(
        productData.tags,
        sharedContext
      )
      productData.tags = tags
    }
  }

  protected async upsertAndAssignProductTypeToProductData(
    productData: ProductTypes.CreateProductDTO | ProductTypes.UpdateProductDTO,
    sharedContext: Context = {}
  ) {
    if (productData.type) {
      const [productType] = await this.productTypeService_.upsert(
        [productData.type!],
        sharedContext
      )

      productData.type = productType?.[0] as ProductTypes.CreateProductTypeDTO
    }
  }

  @InjectTransactionManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async delete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productService_.delete(productIds, sharedContext)

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())
  }

  @InjectManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async softDelete<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    productIds: string[],
    { returnLinkableKeys }: SoftDeleteReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [, cascadedEntitiesMap] = await this.softDelete_(
      productIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      // Map internal table/column names to their respective external linkable keys
      // eg: product.id = product_id, variant.id = variant_id
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager("baseRepository_")
  protected async softDelete_(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TProduct[], Record<string, unknown[]>]> {
    const [entities, cascadedEntitiesMap] =
      await this.productService_.softDelete(productIds, sharedContext)

    return [entities, cascadedEntitiesMap]
  }

  @InjectManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async restore<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    productIds: string[],
    { returnLinkableKeys }: RestoreReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.restore_(
      productIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      // Map internal table/column names to their respective external linkable keys
      // eg: product.id = product_id, variant.id = variant_id
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectManager("baseRepository_")
  @InjectIntoContext({
    messageAggregator: () => new MessageAggregator(),
  })
  async restoreVariants<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    variantIds: string[],
    { returnLinkableKeys }: RestoreReturn<TReturnableLinkableKeys> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.productVariantService_.restore(
      variantIds,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async restore_(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TProduct[], Record<string, unknown[]>]> {
    const [entities, cascadedEntitiesMap] = await this.productService_.restore(
      productIds,
      sharedContext
    )

    await this.emitEvents_(sharedContext.messageAggregator?.getMessages())

    return [entities, cascadedEntitiesMap]
  }

  private async emitEvents_(groupedEvents) {
    if (!this.eventBusModuleService_ || !groupedEvents) {
      return
    }

    const promises: Promise<void>[] = []
    for (const group of Object.keys(groupedEvents)) {
      promises.push(this.eventBusModuleService_?.emit(groupedEvents[group]))
    }

    await Promise.all(promises)
  }
}
