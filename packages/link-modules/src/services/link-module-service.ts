import { ProductService } from "@services"
import { Product } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  JoinerServiceConfig,
  ProductTypes,
} from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { shouldForceTransaction } from "../utils"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  productService: ProductService<any>
}

export default class ProductModuleService<TProduct extends Product = Product>
  implements ProductTypes.IProductModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly productService_: ProductService<TProduct>

  constructor(
    { baseRepository, productService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.productService_ = productService
  }

  __joinerConfig(): JoinerServiceConfig {
    return joinerConfig
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

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
    data: ProductTypes.CreateProductDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const links = await this.productService_.create(data, sharedContext)
    return links
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productService_.delete(productIds, sharedContext)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    return await this.productService_.softDelete(productIds, sharedContext)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TProduct[]> {
    return await this.productService_.restore(productIds, sharedContext)
  }
}
