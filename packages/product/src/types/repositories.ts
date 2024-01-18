import { CreateProductTagDTO, DAL, UpdateProductTagDTO } from "@medusajs/types"
import { ProductTag } from "@models"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProductTagRepository<TEntity extends ProductTag = ProductTag>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateProductTagDTO
      update: UpdateProductTagDTO
    }
  > {}
