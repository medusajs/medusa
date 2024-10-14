import {
  IEventBusModuleService,
  Logger,
  ProductTypes,
} from "@medusajs/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}

export type UpdateProductInput = ProductTypes.UpdateProductDTO & {
  id: string
}

export type UpdateProductCollection =
  ProductTypes.UpdateProductCollectionDTO & {
    products?: string[]
  }

export type CreateProductCollection =
  ProductTypes.CreateProductCollectionDTO & {
    products?: string[]
  }

export type UpdateCollectionInput = ProductTypes.UpdateProductCollectionDTO & {
  id: string
}

export type UpdateTypeInput = ProductTypes.UpdateProductTypeDTO & {
  id: string
}

export type UpdateCategoryInput = ProductTypes.UpdateProductCategoryDTO & {
  id: string
}

export type UpdateTagInput = ProductTypes.UpdateProductTagDTO & {
  id: string
}

export type UpdateProductVariantInput = ProductTypes.UpdateProductVariantDTO & {
  id: string
  product_id?: string | null
}

export type UpdateProductOptionInput = ProductTypes.UpdateProductOptionDTO & {
  id: string
}
