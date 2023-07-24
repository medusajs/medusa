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
  Image,
  Product,
  ProductCategory,
  ProductCollection,
  ProductOption,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import {
  Context,
  CreateProductOnlyDTO,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  JoinerServiceConfig,
  ProductTypes,
} from "@medusajs/types"
import ProductImageService from "./product-image"
import {
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isString,
  kebabCase,
  MedusaContext,
} from "@medusajs/utils"
import { shouldForceTransaction } from "../utils"
import { joinerConfig } from "./../joiner-config"

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
}

export default class ProductModuleService<
  TProduct extends Product = Product,
  TProductVariant extends ProductVariant = ProductVariant,
  TProductTag extends ProductTag = ProductTag,
  TProductCollection extends ProductCollection = ProductCollection,
  TProductCategory extends ProductCategory = ProductCategory,
  TProductImage extends Image = Image,
  TProductType extends ProductType = ProductType,
  TProductOption extends ProductOption = ProductOption
> implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService_: ProductVariantService<
    TProductVariant,
    TProduct
  >
  protected readonly productCategoryService_: ProductCategoryService<TProductCategory>
  protected readonly productTagService_: ProductTagService<TProductTag>
  protected readonly productCollectionService_: ProductCollectionService<TProductCollection>
  protected readonly productImageService_: ProductImageService<TProductImage>
  protected readonly productTypeService_: ProductTypeService<TProductType>
  protected readonly productOptionService_: ProductOptionService<TProductOption>

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
  }

  __joinerConfig(): JoinerServiceConfig {
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

    return JSON.parse(JSON.stringify(products))
  }

  @InjectManager("baseRepository_")
  async retrieve(
    productId: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO> {
    const product = await this.productService_.retrieve(
      productId,
      sharedContext
    )

    return JSON.parse(JSON.stringify(product))
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

    return [JSON.parse(JSON.stringify(products)), count]
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

    return JSON.parse(JSON.stringify(productVariant))
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

    return JSON.parse(JSON.stringify(variants))
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

    return [JSON.parse(JSON.stringify(variants)), count]
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

    return JSON.parse(JSON.stringify(productTag))
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

    return JSON.parse(JSON.stringify(tags))
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

    return [JSON.parse(JSON.stringify(tags)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createTags(
    data: ProductTypes.CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productTags = await this.productTagService_.create(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productTags))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateTags(
    data: ProductTypes.UpdateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productTags = await this.productTagService_.update(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productTags))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteTags(
    productTagIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTagService_.delete(productTagIds, sharedContext)
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

    return JSON.parse(JSON.stringify(productType))
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

    return JSON.parse(JSON.stringify(types))
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

    return [JSON.parse(JSON.stringify(types)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createTypes(
    data: ProductTypes.CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productTypes = await this.productTypeService_.create(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productTypes))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateTypes(
    data: ProductTypes.UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productTypes = await this.productTypeService_.update(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productTypes))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteTypes(
    productTypeIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTypeService_.delete(productTypeIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrieveCollection(
    productCollectionId: string,
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO> {
    const productCollection = await this.productCollectionService_.retrieve(
      productCollectionId,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productCollection))
  }

  @InjectManager("baseRepository_")
  async listCollections(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]> {
    const collections = await this.productCollectionService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(collections))
  }

  @InjectManager("baseRepository_")
  async listAndCountCollections(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: Context
  ): Promise<[ProductTypes.ProductCollectionDTO[], number]> {
    const collections = await this.productCollectionService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(collections))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createCollections(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productCollections = await this.productCollectionService_.create(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productCollections))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateCollections(
    data: ProductTypes.UpdateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const productCollections = await this.productCollectionService_.update(
      data,
      sharedContext
    )

    return JSON.parse(JSON.stringify(productCollections))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteCollections(
    productCollectionIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCollectionService_.delete(
      productCollectionIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async retrieveCategory(
    productCategoryId: string,
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
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
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]> {
    const categories = await this.productCategoryService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }

  @InjectManager("baseRepository_")
  async listAndCountCategories(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
  ): Promise<[ProductTypes.ProductCategoryDTO[], number]> {
    const categories = await this.productCategoryService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }

  async create(data: ProductTypes.CreateProductDTO[], sharedContext?: Context) {
    const products = await this.create_(data, sharedContext)

    return this.baseRepository_.serialize<
      TProduct[],
      ProductTypes.ProductDTO[]
    >(products, {
      populate: true,
    })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
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

    const productsData = await Promise.all(
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

        if (!productData.thumbnail && productData.images?.length) {
          productData.thumbnail = isString(productData.images[0])
            ? (productData.images[0] as string)
            : (productData.images[0] as { url: string }).url
        }

        if (productData.is_giftcard) {
          productData.discountable = false
        }

        if (productData.images?.length) {
          productData.images = await this.productImageService_.upsert(
            productData.images.map((image) =>
              isString(image) ? image : image.url
            ),
            sharedContext
          )
        }

        if (productData.tags?.length) {
          productData.tags = await this.productTagService_.upsert(
            productData.tags,
            sharedContext
          )
        }

        if (isDefined(productData.type)) {
          productData.type_id = (
            await this.productTypeService_.upsert(
              [productData.type as ProductTypes.CreateProductTypeDTO],
              sharedContext
            )
          )?.[0]!?.id
        }

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
          return {
            ...option,
            product: productByHandleMap.get(handle)!,
          }
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

    await Promise.all(
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

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productService_.delete(productIds, sharedContext)
  }

  async softDelete(
    productIds: string[],
    sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.softDelete_(productIds, sharedContext)

    return this.baseRepository_.serialize<
      TProduct[],
      ProductTypes.ProductDTO[]
    >(products, {
      populate: true,
    })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async softDelete_(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    return await this.productService_.softDelete(productIds, sharedContext)
  }

  async restore(
    productIds: string[],
    sharedContext: Context = {}
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.restore_(productIds, sharedContext)

    return this.baseRepository_.serialize<
      TProduct[],
      ProductTypes.ProductDTO[]
    >(products, {
      populate: true,
    })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async restore_(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    return await this.productService_.restore(productIds, sharedContext)
  }
}
