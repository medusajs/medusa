import {
  ProductCategoryService,
  ProductCollectionService,
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import {
  Image,
  Product,
  ProductCategory,
  ProductCollection,
  ProductTag,
  ProductVariant,
} from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import ProductImageService from "./product-image"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService<any>
  productVariantService: ProductVariantService<any>
  productTagService: ProductTagService<any>
  productCategoryService: ProductCategoryService<any>
  productCollectionService: ProductCollectionService<any>
  productImageService: ProductImageService<any>
}

export default class ProductModuleService<
  TProduct = Product,
  TProductVariant = ProductVariant,
  TProductTag = ProductTag,
  TProductCollection = ProductCollection,
  TProductCategory = ProductCategory,
  TProductImage = Image
> implements
    ProductTypes.IProductModuleService<
      TProduct,
      TProductVariant,
      TProductTag,
      TProductCollection,
      TProductCategory,
      TProductImage
    >
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService: ProductVariantService<TProductVariant>
  protected readonly productCategoryService: ProductCategoryService<TProductCategory>
  protected readonly productTagService: ProductTagService<TProductTag>
  protected readonly productCollectionService: ProductCollectionService<TProductCollection>
  protected readonly productImageService: ProductImageService<TProductImage>

  constructor({
    baseRepository,
    productService,
    productVariantService,
    productTagService,
    productCategoryService,
    productCollectionService,
    productImageService,
  }: InjectedDependencies) {
    this.baseRepository_ = baseRepository
    this.productService_ = productService
    this.productVariantService = productVariantService
    this.productTagService = productTagService
    this.productCategoryService = productCategoryService
    this.productCollectionService = productCollectionService
    this.productImageService = productImageService
  }

  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.productService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(products))
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: Context
  ): Promise<[ProductTypes.ProductDTO[], number]> {
    const [products, count] = await this.productService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [JSON.parse(JSON.stringify(products)), count]
  }

  async listVariants(
    filters: ProductTypes.FilterableProductVariantProps = {},
    config: FindConfig<ProductTypes.ProductVariantDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const variants = await this.productVariantService.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(variants))
  }

  async listTags(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const tags = await this.productTagService.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(tags))
  }

  async listCollections(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCollectionDTO[]> {
    const collections = await this.productCollectionService.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(collections))
  }

  async listCategories(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductCategoryDTO[]> {
    const categories = await this.productCategoryService.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }

  async create(
    data: ProductTypes.CreateProductDTO[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = (await this.baseRepository_.transaction(
      async (manager) => {
        sharedContext = sharedContext || {
          transactionManager: manager,
        }

        const productVariantsMap = new Map<
          string,
          ProductTypes.CreateProductVariantDTO
        >()

        const productsData: ProductTypes.CreateProductOnlyDTO[] =
          await Promise.all(
            data.map(async (product) => {
              const variants = product.variants
              delete product.variants

              if (!product.thumbnail && product.images?.length) {
                product.thumbnail = product.images[0]
              }

              if (product.is_giftcard) {
                product.discountable = false
              }

              if (product.images?.length) {
                product.images = (
                  await this.productImageService.upsert(
                    product.images,
                    sharedContext
                  )
                ).map((image) => (image as Image).url)
              }

              if (product.tags?.length) {
                product.tags = (await this.productTagService.upsert(
                  product.tags,
                  sharedContext
                )) as ProductTag[]
              }

              return product
            })
          )

        // TODO
        // Shipping profile is not part of the module
        // as well as sales channel

        const products = this.productService_.create(productsData, {
          transactionManager: manager,
        })

        return products
      },
      { transaction: sharedContext?.transactionManager }
    )) as TProduct[]

    return JSON.parse(JSON.stringify(products))
  }
}
