import { AbstractService } from "@medusajs/utils"
import { IProductImageRepository } from "@types"
import ProductImage from "../../models/product-image"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductImageService<
  TEntity extends ProductImage = ProductImage
> extends AbstractService<
    TEntity,
    { imageRepository: IProductImageRepository<TEntity> }
  > {}
