import { BatchJob, Product, ProductVariant } from "../../../models"
import { Selector } from "../../../types/common"

export type ProductExportBatchJobContext = {
  retry_count?: number
  max_retry?: number
  offset?: number
  limit?: number
  batch_size?: number
  order?: string
  fields?: string
  expand?: string
  shape: {
    prices: ProductExportPriceData[]
    dynamicOptionColumnCount: number
    dynamicImageColumnCount: number
    dynamicSalesChannelsColumnCount: number
  }
  list_config?: {
    select?: string[]
    relations?: string[]
    skip?: number
    take?: number
    order?: Record<string, "ASC" | "DESC">
  }
  filterable_fields?: Selector<unknown>
}

export type ProductExportPriceData = {
  currency_code?: string
  region?: { name: string; currency_code: string; id: string }
}

export type ProductExportBatchJob = BatchJob & {
  context: ProductExportBatchJobContext
}

export type ProductExportColumnSchemaEntity = "product" | "variant"

export type ProductExportColumnSchemaDescriptor =
  | {
      accessor: (product: Product) => string
      entityName: Extract<ProductExportColumnSchemaEntity, "product">
    }
  | {
      accessor: (variant: ProductVariant) => string
      entityName: Extract<ProductExportColumnSchemaEntity, "variant">
    }

export const productExportSchemaDescriptors = new Map<
  string,
  ProductExportColumnSchemaDescriptor
>([
  [
    "Product ID",
    {
      accessor: (product: Product): string => product?.id ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Handle",
    {
      accessor: (product: Product): string => product?.handle ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Title",
    {
      accessor: (product: Product): string => product?.title ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Subtitle",
    {
      accessor: (product: Product): string => product?.subtitle ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Description",
    {
      accessor: (product: Product): string => product?.description ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Status",
    {
      accessor: (product: Product): string => product?.status ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Thumbnail",
    {
      accessor: (product: Product): string => product?.thumbnail ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Weight",
    {
      accessor: (product: Product): string => product?.weight?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Length",
    {
      accessor: (product: Product): string => product?.length?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Width",
    {
      accessor: (product: Product): string => product?.width?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Height",
    {
      accessor: (product: Product): string => product?.height?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product HS Code",
    {
      accessor: (product: Product): string =>
        product?.hs_code?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Origin Country",
    {
      accessor: (product: Product): string =>
        product?.origin_country?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product MID Code",
    {
      accessor: (product: Product): string =>
        product?.mid_code?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Material",
    {
      accessor: (product: Product): string =>
        product?.material?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Collection Title",
    {
      accessor: (product: Product): string => product?.collection?.title ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Collection Handle",
    {
      accessor: (product: Product): string => product?.collection?.handle ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Type",
    {
      accessor: (product: Product): string => product?.type?.value ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Tags",
    {
      accessor: (product: Product): string =>
        (product.tags.map((t) => t.value) ?? []).join(","),
      entityName: "product",
    },
  ],
  [
    "Product Discountable",
    {
      accessor: (product: Product): string =>
        product?.discountable?.toString() ?? "",
      entityName: "product",
    },
  ],
  [
    "Product External ID",
    {
      accessor: (product: Product): string => product?.external_id ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Profile Name",
    {
      accessor: (product: Product): string => product?.profile?.name ?? "",
      entityName: "product",
    },
  ],
  [
    "Product Profile Type",
    {
      accessor: (product: Product): string => product?.profile?.type ?? "",
      entityName: "product",
    },
  ],
  [
    "Variant ID",
    {
      accessor: (variant: ProductVariant): string => variant?.id ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Title",
    {
      accessor: (variant: ProductVariant): string => variant?.title ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant SKU",
    {
      accessor: (variant: ProductVariant): string => variant?.sku ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Barcode",
    {
      accessor: (variant: ProductVariant): string => variant?.barcode ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Inventory Quantity",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.inventory_quantity?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Allow backorder",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.allow_backorder?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Manage inventory",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.manage_inventory?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Weight",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.weight?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Length",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.length?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Width",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.width?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Height",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.height?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant HS Code",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.hs_code?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Origin Country",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.origin_country?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant MID Code",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.mid_code?.toString() ?? "",
      entityName: "variant",
    },
  ],
  [
    "Variant Material",
    {
      accessor: (variant: ProductVariant): string =>
        variant?.material?.toString() ?? "",
      entityName: "variant",
    },
  ],
])
