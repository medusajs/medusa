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
  ProductTypes,
} from "@medusajs/types"
import ProductImageService from "./product-image"
import { isDefined, kebabCase } from "@medusajs/utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService<any>
  productVariantService: ProductVariantService<any>
  productTagService: ProductTagService<any>
  productCategoryService: ProductCategoryService<any>
  productCollectionService: ProductCollectionService<any>
  productImageService: ProductImageService<any>
  productTypeService: ProductTypeService<any>
  productOptionService: ProductOptionService<any>
}

export default class ProductModuleService<
  TProduct = Product,
  TProductVariant = ProductVariant,
  TProductTag = ProductTag,
  TProductCollection = ProductCollection,
  TProductCategory = ProductCategory,
  TProductImage = Image,
  TProductType = ProductType,
  TProductOption = ProductOption
> implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService_: ProductVariantService<TProductVariant>
  protected readonly productCategoryService_: ProductCategoryService<TProductCategory>
  protected readonly productTagService_: ProductTagService<TProductTag>
  protected readonly productCollectionService_: ProductCollectionService<TProductCollection>
  protected readonly productImageService_: ProductImageService<TProductImage>
  protected readonly productTypeService_: ProductTypeService<TProductImage>
  protected readonly productOptionService_: ProductOptionService<TProductOption>

  constructor({
    baseRepository,
    productService,
    productVariantService,
    productTagService,
    productCategoryService,
    productCollectionService,
    productImageService,
    productTypeService,
    productOptionService,
  }: InjectedDependencies) {
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
    const variants = await this.productVariantService_.list(
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
    const tags = await this.productTagService_.list(
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
    const collections = await this.productCollectionService_.list(
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
    const categories = await this.productCategoryService_.list(
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
          ProductTypes.CreateProductVariantDTO[]
        >()
        const productOptionsMap = new Map<
          string,
          ProductTypes.CreateProductOptionDTO[]
        >()

        const productsData = await Promise.all(
          data.map(async (product) => {
            if (!product.handle) {
              product.handle = kebabCase(product.title)
            }

            const variants = product.variants
            const options = product.options
            delete product.options
            delete product.variants

            productVariantsMap.set(product.handle!, variants ?? [])
            productOptionsMap.set(product.handle!, options ?? [])

            if (!product.thumbnail && product.images?.length) {
              product.thumbnail = product.images[0].url
            }

            if (product.is_giftcard) {
              product.discountable = false
            }

            if (product.images?.length) {
              product.images = (await this.productImageService_.upsert(
                product.images.map((image) => image.url),
                sharedContext
              )) as unknown as Image[]
            }

            if (product.tags?.length) {
              product.tags = (await this.productTagService_.upsert(
                product.tags,
                sharedContext
              )) as unknown as ProductTag[]
            }

            if (isDefined(product.type)) {
              product.type_id = (
                (await this.productTagService_.upsert(
                  [product.type],
                  sharedContext
                )) as unknown as ProductType[]
              )?.[0]!.id
            }

            return product as CreateProductOnlyDTO
          })
        )

        // TODO
        // Shipping profile is not part of the module
        // as well as sales channel

        const products = (await this.productService_.create(productsData, {
          transactionManager: manager,
        })) as unknown as Product[]

        const productByHandleMap = new Map<string, Product>(
          products.map((product) => [product.handle!, product])
        )

        const productOptionsData = [...productOptionsMap]
          .map(([handle, options]) => {
            return options.map((option) => {
              return {
                ...option,
                product: {
                  id: productByHandleMap.get(handle)!.id,
                },
              }
            })
          })
          .flat()

        const productOptions = await this.productOptionService_.create(
          productOptionsData,
          {
            transactionManager: manager,
          }
        )

        return products
      },
      { transaction: sharedContext?.transactionManager }
    )) as TProduct[]

    return JSON.parse(JSON.stringify(products))
  }
}
