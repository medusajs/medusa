import type {
  Context,
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the products update.
 */
export type UpdateProductsStepInput =
  | {
      /**
       * The filters to select the products to update.
       */
      selector: ProductTypes.FilterableProductProps
      /**
       * The data to update the products with.
       */
      update: ProductTypes.UpdateProductDTO
    }
  | {
      /**
       * The data to create or update products.
       */
      products: ProductTypes.UpsertProductDTO[]
    }

type ProductOptionValueCompensation = {
  product_id: string
  product_option_id: string
  add?: {
    value_id: string
    link_id: string
    known_link_ids: string[]
  }[]
  remove?: { value_id: string; link_id: string }[]
}

type ProductOptionLinkRestoration = ProductTypes.ProductOptionProductPair & {
  link_id: string
  known_link_ids: string[]
  value_links: { id: string; value_id: string }[]
}

type ProductOptionLinkCompensation = {
  add: ProductOptionLinkRestoration[]
  remove: ProductTypes.ProductOptionProductPair[]
}

type VariantUpdateState = {
  product_id: string
  product_options: {
    id: string
    option_id: string
    option_deleted: boolean
    value_link_ids: string[]
    value_ids: string[]
  }[]
  product_option_links: {
    id: string
    option_id: string
    updated_at: string
    version: string
    deleted: boolean
  }[]
  watched_options: {
    id: string
    title: string
    is_exclusive: boolean
    metadata: Record<string, unknown> | null
    version: string
    deleted: boolean
  }[]
  variants: {
    id: string
    updated_at: string
    option_value_ids: string[]
  }[]
  option_values: {
    id: string
    value: string
    option_id: string
    option_title: string
    metadata: Record<string, unknown> | null
    rank: number | null
    value_deleted: boolean
    option_deleted: boolean
  }[]
}

type ProductOptionValueExpectedDeletion = {
  id: string
  option_id: string
  updated_at: string
}

type ProductUpdateState = {
  product_id: string
  version: string
  fields: Record<string, unknown>
}

type ProductOptionValueUpdateContext = Context & {
  optionValueUpdateCompensation?: ProductOptionValueCompensation[]
  variantUpdateExpectedState?: VariantUpdateState[]
  variantUpdatePreviousProducts?: ProductTypes.ProductDTO[]
  variantUpdateCondition?: VariantUpdateState[]
  variantUpdateSkippedProductIds?: string[]
  variantUpdateRequiredValueIdsByProductId?: Record<string, string[]>
  optionLinkUpdateForwardCompensation?: ProductOptionLinkCompensation
  optionLinkUpdateCompensation?: ProductOptionLinkCompensation
  optionValueUpdateCreatedValueIds?: string[]
  optionValueUpdateCreatedValues?: ProductOptionValueExpectedDeletion[]
  optionValueUpdateExpectedDeletions?: ProductOptionValueExpectedDeletion[]
  optionValueUpdateExpectedRestorations?: Array<{
    product_id: string
    product_option_id: string
    value_id: string
    link_id: string
    known_link_ids: string[]
  }>
  optionValueUpdateExpectedRemovals?: Array<{
    product_id: string
    product_option_id: string
    value_id: string
    link_id: string
  }>
  productUpdateFieldsByProductId?: Record<string, string[]>
  productUpdatePreviousProducts?: ProductTypes.ProductDTO[]
  productUpdatePreviousState?: ProductUpdateState[]
  productUpdateExpectedState?: ProductUpdateState[]
  productUpdateCondition?: ProductUpdateState[]
  skipMissingProducts?: boolean
}

type ProductOptionValueRestorationContext = Context & {
  optionValueUpdateExpectedRestorations: Array<{
    product_id: string
    product_option_id: string
    value_id: string
    link_id: string
    known_link_ids: string[]
  }>
}

const structuralProductUpdateFields = new Set([
  "id",
  "option_ids",
  "option_value_updates",
  "variants",
])

const getCompensationFields = (update: object) => {
  const aliases: Record<string, string> = {
    category_ids: "categories",
    tag_ids: "tags",
  }
  const fields = Object.keys(update)
    .filter((field) => !structuralProductUpdateFields.has(field))
    .map((field) => aliases[field] ?? field)

  if (Object.prototype.hasOwnProperty.call(update, "is_giftcard")) {
    fields.push("discountable")
  }

  return [...new Set(fields)]
}

const toProductUpdate = (
  product: ProductTypes.ProductDTO,
  includeVariants: boolean,
  compensationFields: string[],
  previousState?: ProductUpdateState,
  expectedState?: ProductUpdateState
) => {
  const { variants } = product
  const productFields = product as unknown as Record<string, unknown>
  const fields = Object.fromEntries(
    compensationFields.map((field) => [
      field,
      Object.prototype.hasOwnProperty.call(previousState?.fields ?? {}, field)
        ? previousState!.fields[field]
        : productFields[field],
    ])
  )
  if (compensationFields.includes("metadata")) {
    const previousMetadata = fields.metadata as
      | Record<string, unknown>
      | null
      | undefined
    const expectedMetadata = expectedState?.fields.metadata as
      | Record<string, unknown>
      | null
      | undefined
    if (previousMetadata === null) {
      fields.metadata = null
    } else if (previousMetadata !== undefined) {
      fields.metadata = {
        ...previousMetadata,
        ...Object.fromEntries(
          Object.keys(expectedMetadata ?? {})
            .filter((key) => !(key in previousMetadata))
            .map((key) => [key, ""])
        ),
      }
    }
  }
  const optionTitleByValueId = new Map(
    (product.options ?? []).flatMap((option) =>
      (option.values ?? []).map((value) => [value.id, option.title] as const)
    )
  )

  return {
    id: product.id,
    ...fields,
    ...(includeVariants && variants !== undefined
      ? {
          variants: variants.map((variant) => ({
            ...variant,
            options: Object.fromEntries(
              (variant.options ?? []).map((value) => [
                optionTitleByValueId.get(value.id)!,
                value.value,
              ])
            ),
          })),
        }
      : {}),
  }
}

export const updateProductsStepId = "update-products"
/**
 * This step updates one or more products.
 *
 * @example
 * To update products by their ID:
 *
 * ```ts
 * const data = updateProductsStep({
 *   products: [
 *     {
 *       id: "prod_123",
 *       title: "Shirt"
 *     }
 *   ]
 * })
 * ```
 *
 * To update products matching a filter:
 *
 * ```ts
 * const data = updateProductsStep({
 *   selector: {
 *     collection_id: "collection_123",
 *   },
 *   update: {
 *     material: "cotton",
 *   }
 * })
 * ```
 */
export const updateProductsStep = createStep(
  updateProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if ("products" in data) {
      if (data.products.some((p) => !p.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product ID is required when doing a batch update of products"
        )
      }

      if (!data.products.length) {
        return new StepResponse([], {
          prevProducts: [],
          optionValueCompensation: [],
          optionLinkUpdateCompensation: { add: [], remove: [] },
          variantUpdateExpectedState: [],
          variantUpdatePreviousProducts: [],
          optionValueUpdateCreatedValues: [],
          touchedFieldsByProductId: {},
          productUpdatePreviousState: [],
          productUpdateExpectedState: [],
        })
      }

      const touchedFieldsByProductId = Object.fromEntries(
        data.products.map((product) => [
          product.id as string,
          getCompensationFields(product),
        ])
      )

      const prevProducts: ProductTypes.ProductDTO[] = []
      const optionValueCompensation: ProductOptionValueCompensation[] = []
      const optionLinkUpdateCompensation: ProductOptionLinkCompensation = {
        add: [],
        remove: [],
      }
      const variantUpdateExpectedState: VariantUpdateState[] = []
      const variantUpdatePreviousProducts: ProductTypes.ProductDTO[] = []
      const optionValueUpdateCreatedValueIds: string[] = []
      const optionValueUpdateCreatedValues: ProductOptionValueExpectedDeletion[] =
        []
      const productUpdatePreviousState: ProductUpdateState[] = []
      const productUpdateExpectedState: ProductUpdateState[] = []
      const products = await service.upsertProducts(data.products, {
        __type: "MedusaContext",
        optionValueUpdateCompensation: optionValueCompensation,
        optionLinkUpdateForwardCompensation: optionLinkUpdateCompensation,
        variantUpdateExpectedState,
        variantUpdatePreviousProducts,
        optionValueUpdateCreatedValueIds,
        optionValueUpdateCreatedValues,
        productUpdateFieldsByProductId: touchedFieldsByProductId,
        productUpdatePreviousProducts: prevProducts,
        productUpdatePreviousState,
        productUpdateExpectedState,
      } as ProductOptionValueUpdateContext)
      return new StepResponse(products, {
        prevProducts,
        optionValueCompensation,
        optionLinkUpdateCompensation,
        variantUpdateExpectedState,
        variantUpdatePreviousProducts,
        optionValueUpdateCreatedValues,
        touchedFieldsByProductId,
        productUpdatePreviousState,
        productUpdateExpectedState,
      })
    }

    const matchedProducts = await service.listProducts(data.selector, {
      select: ["id"],
    })
    const touchedFields = getCompensationFields(data.update)
    const touchedFieldsByProductId = Object.fromEntries(
      matchedProducts.map((product) => [product.id, touchedFields])
    )

    const prevProducts: ProductTypes.ProductDTO[] = []
    const optionValueCompensation: ProductOptionValueCompensation[] = []
    const optionLinkUpdateCompensation: ProductOptionLinkCompensation = {
      add: [],
      remove: [],
    }
    const variantUpdateExpectedState: VariantUpdateState[] = []
    const variantUpdatePreviousProducts: ProductTypes.ProductDTO[] = []
    const optionValueUpdateCreatedValueIds: string[] = []
    const optionValueUpdateCreatedValues: ProductOptionValueExpectedDeletion[] =
      []
    const productUpdatePreviousState: ProductUpdateState[] = []
    const productUpdateExpectedState: ProductUpdateState[] = []
    const products = await service.upsertProducts(
      matchedProducts.map((product) => ({
        ...data.update,
        id: product.id,
      })),
      {
        __type: "MedusaContext",
        optionValueUpdateCompensation: optionValueCompensation,
        optionLinkUpdateForwardCompensation: optionLinkUpdateCompensation,
        variantUpdateExpectedState,
        variantUpdatePreviousProducts,
        optionValueUpdateCreatedValueIds,
        optionValueUpdateCreatedValues,
        productUpdateFieldsByProductId: touchedFieldsByProductId,
        productUpdatePreviousProducts: prevProducts,
        productUpdatePreviousState,
        productUpdateExpectedState,
      } as ProductOptionValueUpdateContext
    )
    return new StepResponse(products, {
      prevProducts,
      optionValueCompensation,
      optionLinkUpdateCompensation,
      variantUpdateExpectedState,
      variantUpdatePreviousProducts,
      optionValueUpdateCreatedValues,
      touchedFieldsByProductId,
      productUpdatePreviousState,
      productUpdateExpectedState,
    })
  },
  async (compensationData, { container }) => {
    const prevProducts = compensationData?.prevProducts ?? []
    const optionValueCompensation =
      compensationData?.optionValueCompensation ?? []
    const optionLinkUpdateCompensation =
      compensationData?.optionLinkUpdateCompensation ?? {
        add: [],
        remove: [],
      }
    const variantUpdateExpectedState =
      compensationData?.variantUpdateExpectedState ?? []
    const variantUpdatePreviousProducts =
      compensationData?.variantUpdatePreviousProducts ?? []
    const optionValueUpdateCreatedValues =
      compensationData?.optionValueUpdateCreatedValues ?? []
    const touchedFieldsByProductId =
      compensationData?.touchedFieldsByProductId ?? {}
    const productUpdatePreviousState =
      compensationData?.productUpdatePreviousState ?? []
    const productUpdateExpectedState =
      compensationData?.productUpdateExpectedState ?? []

    if (!prevProducts.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)
    const previousVariantProductsById = new Map(
      variantUpdatePreviousProducts.map((product) => [product.id, product])
    )
    const previousProductUpdateStateById = new Map(
      productUpdatePreviousState.map((state) => [state.product_id, state])
    )
    const expectedProductUpdateStateById = new Map(
      productUpdateExpectedState.map((state) => [state.product_id, state])
    )
    const variantUpdateRequiredValueIdsByProductId = Object.fromEntries(
      variantUpdatePreviousProducts.map((product) => [
        product.id,
        [
          ...new Set(
            (product.variants ?? []).flatMap((variant) =>
              (variant.options ?? []).map((value) => value.id)
            )
          ),
        ],
      ])
    )
    const guardedProductIds = new Set(
      variantUpdateExpectedState.map((state) => state.product_id)
    )

    const valueLinksToRestore = optionValueCompensation
      .filter((update) => update.add?.length)
      .map((update) => ({
        product_id: update.product_id,
        product_option_id: update.product_option_id,
        add: update.add!.map((link) => link.value_id),
      }))
    const expectedRestorations = optionValueCompensation.flatMap((update) =>
      (update.add ?? []).map((link) => ({
        product_id: update.product_id,
        product_option_id: update.product_option_id,
        ...link,
      }))
    )
    const expectedRemovals = optionValueCompensation.flatMap((update) =>
      (update.remove ?? []).map((link) => ({
        product_id: update.product_id,
        product_option_id: update.product_option_id,
        value_id: link.value_id,
        link_id: link.link_id,
      }))
    )
    const unguardedValueLinksToRestore = valueLinksToRestore.filter(
      (update) => !guardedProductIds.has(update.product_id)
    )
    if (unguardedValueLinksToRestore.length) {
      await service.updateProductOptionValuesOnProduct(
        unguardedValueLinksToRestore,
        {
          __type: "MedusaContext",
          optionValueUpdateExpectedRestorations: expectedRestorations.filter(
            (restoration) => !guardedProductIds.has(restoration.product_id)
          ),
        } as ProductOptionValueRestorationContext
      )
    }

    const guardedValueUpdatesByProductId = new Map<
      string,
      ProductTypes.ProductOptionProductValueUpdate[]
    >()
    for (const update of optionValueCompensation) {
      if (!guardedProductIds.has(update.product_id)) {
        continue
      }
      const inverse = {
        product_id: update.product_id,
        product_option_id: update.product_option_id,
        ...(update.add?.length
          ? { add: update.add.map((link) => link.value_id) }
          : {}),
        ...(update.remove?.length
          ? { remove: update.remove.map((link) => link.value_id) }
          : {}),
      }
      guardedValueUpdatesByProductId.set(update.product_id, [
        ...(guardedValueUpdatesByProductId.get(update.product_id) ?? []),
        inverse,
      ])
    }
    const variantUpdateSkippedProductIds: string[] = []
    await service.upsertProducts(
      prevProducts.map((product) => {
        const previousVariantProduct = previousVariantProductsById.get(
          product.id
        )
        const compensationProduct = previousVariantProduct
          ? {
              ...product,
              options: previousVariantProduct.options,
              variants: previousVariantProduct.variants,
            }
          : product
        const update = toProductUpdate(
          compensationProduct,
          !!previousVariantProduct,
          touchedFieldsByProductId[product.id] ?? [],
          previousProductUpdateStateById.get(product.id),
          expectedProductUpdateStateById.get(product.id)
        )
        const guardedValueUpdates =
          guardedValueUpdatesByProductId.get(product.id) ?? []
        return guardedValueUpdates.length
          ? {
              ...update,
              option_value_updates: guardedValueUpdates.map(
                ({ product_id: _productId, ...valueUpdate }) => valueUpdate
              ),
            }
          : update
      }),
      {
        __type: "MedusaContext",
        variantUpdateCondition: variantUpdateExpectedState,
        variantUpdateSkippedProductIds,
        variantUpdateRequiredValueIdsByProductId,
        optionLinkUpdateCompensation,
        productUpdateFieldsByProductId: touchedFieldsByProductId,
        productUpdateCondition: productUpdateExpectedState,
        optionValueUpdateExpectedRestorations: expectedRestorations.filter(
          (restoration) => guardedProductIds.has(restoration.product_id)
        ),
        optionValueUpdateExpectedRemovals: expectedRemovals.filter((removal) =>
          guardedProductIds.has(removal.product_id)
        ),
        optionValueUpdateExpectedDeletions: optionValueUpdateCreatedValues,
        skipMissingProducts: true,
      } as ProductOptionValueUpdateContext
    )
  }
)
