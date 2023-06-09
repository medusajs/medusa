import {
  ProductCategoryService,
  ProductCollectionService,
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductTag,
  ProductVariant,
} from "@models"
import { FindConfig, ProductTypes, SharedContext } from "@medusajs/types"

type InjectedDependencies = {
  productService: ProductService<any>
  productVariantService: ProductVariantService<any>
  productTagService: ProductTagService<any>
  productCategoryService: ProductCategoryService<any>
  productCollectionService: ProductCollectionService<any>
}

export default class ProductModuleService<
  TProduct = Product,
  TProductVariant = ProductVariant,
  TProductTag = ProductTag,
  TProductCollection = ProductCollection,
  TProductCategory = ProductCategory
> implements
    ProductTypes.IProductModuleService<
      TProduct,
      TProductVariant,
      TProductTag,
      TProductCollection,
      TProductCategory
    >
{
  protected readonly productService_: ProductService<TProduct>
  protected readonly productVariantService: ProductVariantService<TProductVariant>
  protected readonly productCategoryService: ProductCategoryService<TProductCategory>
  protected readonly productTagService: ProductTagService<TProductTag>
  protected readonly productCollectionService: ProductCollectionService<TProductCollection>

  constructor({
    productService,
    productVariantService,
    productTagService,
    productCategoryService,
    productCollectionService,
  }: InjectedDependencies) {
    this.productService_ = productService
    this.productVariantService = productVariantService
    this.productTagService = productTagService
    this.productCategoryService = productCategoryService
    this.productCollectionService = productCollectionService
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
    sharedContext?: SharedContext
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
    sharedContext?: SharedContext
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
    sharedContext?: SharedContext
  ): Promise<ProductTypes.ProductCategoryDTO[]> {
    const categories = await this.productCategoryService.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(categories))
  }
}
