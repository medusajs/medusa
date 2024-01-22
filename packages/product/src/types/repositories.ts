import { DAL, ProductTypes, WithRequiredProperty } from "@medusajs/types"
import {
  Image,
  Product,
  ProductCollection,
  ProductOption,
  ProductOptionValue,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import { UpdateProductDTO } from "./services/product"
import {
  CreateProductCollection,
  UpdateProductCollection,
} from "./services/product-collection"
import {
  CreateProductOptionValueDTO,
  UpdateProductOptionValueDTO,
} from "./services/product-option-value"
import { UpdateProductVariantDTO } from "./services/product-variant"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductRepository<TEntity extends Product = Product>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: WithRequiredProperty<ProductTypes.CreateProductOnlyDTO, "status">
      update: WithRequiredProperty<UpdateProductDTO, "id">
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductCollectionRepository<
  TEntity extends ProductCollection = ProductCollection
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateProductCollection
      update: UpdateProductCollection
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductImageRepository<TEntity extends Image = Image>
  extends DAL.RepositoryService<TEntity> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductOptionRepository<
  TEntity extends ProductOption = ProductOption
> extends DAL.RepositoryService<
    TEntity,
    {
      create: ProductTypes.CreateProductOptionDTO
      update: ProductTypes.UpdateProductOptionDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductOptionValueRepository<
  TEntity extends ProductOptionValue = ProductOptionValue
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateProductOptionValueDTO
      update: UpdateProductOptionValueDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductTagRepository<TEntity extends ProductTag = ProductTag>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: ProductTypes.CreateProductTagDTO
      update: ProductTypes.UpdateProductTagDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductTypeRepository<
  TEntity extends ProductType = ProductType
> extends DAL.RepositoryService<
    TEntity,
    {
      create: ProductTypes.CreateProductTypeDTO
      update: ProductTypes.UpdateProductTypeDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductVariantRepository<
  TEntity extends ProductVariant = ProductVariant
> extends DAL.RepositoryService<
    TEntity,
    {
      create: ProductTypes.CreateProductVariantOnlyDTO
      update: UpdateProductVariantDTO
    }
  > {}
