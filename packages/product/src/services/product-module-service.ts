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
import { isDefined, isString, kebabCase } from "@medusajs/utils"

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

  async retrieve(
    productId: string,
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO> {
    const product = await this.productService_.retrieve(
      productId,
      sharedContext
    )

    return JSON.parse(JSON.stringify(product))
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
              productData.images = (await this.productImageService_.upsert(
                productData.images.map((image) =>
                  isString(image) ? image : image.url
                ),
                sharedContext
              )) as unknown as Image[]
            }

            if (productData.tags?.length) {
              productData.tags = (await this.productTagService_.upsert(
                productData.tags,
                sharedContext
              )) as unknown as ProductTag[]
            }

            if (isDefined(productData.type)) {
              productData.type_id = (
                (await this.productTypeService_.upsert(
                  [productData.type as ProductTypes.CreateProductTypeDTO],
                  sharedContext
                )) as unknown as ProductType[]
              )?.[0]!.id
            }

            return productData as CreateProductOnlyDTO
          })
        )

        // TODO
        // Shipping profile is not part of the module
        // as well as sales channel

        const products = (await this.productService_.create(
          productsData,
          sharedContext
        )) as unknown as Product[]

        const productByHandleMap = new Map<string, Product>(
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

        const productOptions = (await this.productOptionService_.create(
          productOptionsData,
          sharedContext
        )) as unknown as ProductOption[]

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
      },
      { transaction: sharedContext?.transactionManager }
    )) as TProduct[]

    return JSON.parse(JSON.stringify(products))
  }

  async delete(
    productIds: string[],
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = this.productService_.delete(productIds, sharedContext)
    return JSON.parse(JSON.stringify(products))
  }
}
