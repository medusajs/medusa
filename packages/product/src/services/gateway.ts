import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import { Product, ProductCollection, ProductTag, ProductVariant } from "@models"
import { FindConfig, ProductTypes, SharedContext } from "@medusajs/types"

type InjectedDependencies = {
  productService: ProductService<any>
  productVariantService: ProductVariantService<any>
  productTagService: ProductTagService<any>
}

export default class GatewayService<
  TProduct = Product,
  TProductVariant = ProductVariant,
  TProductTag = ProductTag,
  TProductCollection = ProductCollection
> implements
    ProductTypes.IProductService<
      TProduct,
      TProductVariant,
      TProductTag,
      TProductCollection
    >
{
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService: ProductVariantService<TProductVariant>
  protected readonly productTagService: ProductTagService<TProductTag>

  constructor({
    productService,
    productVariantService,
    productTagService,
  }: InjectedDependencies) {
    this.productService_ = productService
    this.productVariantService = productVariantService
    this.productTagService = productTagService
  }

  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<ProductTypes.ProductDTO> = {},
    sharedContext?: SharedContext
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
    sharedContext?: SharedContext
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
    sharedContext?: SharedContext
  ): Promise<ProductTypes.ProductVariantDTO[]> {
    const variants = await this.productVariantService.list()
    return JSON.parse(JSON.stringify(variants))
  }

  async listTags(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: SharedContext
  ): Promise<ProductTypes.ProductTagDTO[]> {
    const tags = await this.productTagService.list()
    return JSON.parse(JSON.stringify(tags))
  }

  async listCollections(): Promise<ProductTypes.ProductCollectionDTO[]> {
    return [] as ProductTypes.ProductCollectionDTO[]
  }
}
