import { Product, ProductVariant } from "../../../../models"
import {
  ProductColumnDefinition,
  ProductExportPriceData,
  TBuiltProductImportLine,
  TParsedProductImportRowData,
} from "./types"
import { CsvSchema, CsvSchemaColumn } from "../../../../interfaces/csv-parser"

export const productColumnsDefinition: ProductColumnDefinition = {
  "Product id": {
    importDescriptor: {
      name: "Product id",
      mapTo: "product.id",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.id ?? "",
      entityName: "product",
    },
  },
  "Product Handle": {
    importDescriptor: {
      name: "Product Handle",
      mapTo: "product.handle",
      required: true,
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.handle ?? "",
      entityName: "product",
    },
  },
  "Product Title": {
    importDescriptor: {
      name: "Product Title",
      mapTo: "product.title",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.title ?? "",
      entityName: "product",
    },
  },
  "Product Subtitle": {
    importDescriptor: {
      name: "Product Subtitle",
      mapTo: "product.subtitle",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.subtitle ?? "",
      entityName: "product",
    },
  },
  "Product Description": {
    importDescriptor: {
      name: "Product Description",
      mapTo: "product.description",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.description ?? "",
      entityName: "product",
    },
  },
  "Product Status": {
    importDescriptor: {
      name: "Product Status",
      mapTo: "product.status",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.status ?? "",
      entityName: "product",
    },
  },
  "Product Thumbnail": {
    importDescriptor: {
      name: "Product Thumbnail",
      mapTo: "product.thumbnail",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.thumbnail ?? "",
      entityName: "product",
    },
  },
  "Product Weight": {
    importDescriptor: {
      name: "Product Weight",
      mapTo: "product.weight",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.weight?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Length": {
    importDescriptor: {
      name: "Product Length",
      mapTo: "product.length",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.length?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Width": {
    importDescriptor: {
      name: "Product Width",
      mapTo: "product.width",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.width?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Height": {
    importDescriptor: {
      name: "Product Height",
      mapTo: "product.height",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.height?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product HS Code": {
    importDescriptor: {
      name: "Product HS Code",
      mapTo: "product.hs_code",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.hs_code?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Origin Country": {
    importDescriptor: {
      name: "Product Origin Country",
      mapTo: "product.origin_country",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.origin_country?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product MID Code": {
    importDescriptor: {
      name: "Product MID Code",
      mapTo: "product.mid_code",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.mid_code?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Material": {
    importDescriptor: {
      name: "Product Material",
      mapTo: "product.material",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.material?.toString() ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-COLLECTION

  "Product Collection Title": {
    importDescriptor: {
      name: "Product Collection Title",
      mapTo: "product.collection.title",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.collection?.title ?? "",
      entityName: "product",
    },
  },
  "Product Collection Handle": {
    importDescriptor: {
      name: "Product Collection Handle",
      mapTo: "product.collection.handle",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.collection?.handle ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-TYPE

  "Product Type": {
    importDescriptor: {
      name: "Product Type",
      match: /Product Type/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key,
        value
      ): TBuiltProductImportLine => {
        if (typeof value === "undefined" || value === null) {
          builtLine["product.type"] = undefined
        } else {
          builtLine["product.type.value"] = value
        }

        return builtLine
      },
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.type?.value ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-TAGS

  "Product Tags": {
    importDescriptor: {
      name: "Product Tags",
      mapTo: "product.tags",
      transform: (value: string) =>
        `${value}`.split(",").map((v) => ({ value: v })),
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        (product.tags.map((t) => t.value) ?? []).join(","),
      entityName: "product",
    },
  },

  //

  "Product Discountable": {
    importDescriptor: {
      name: "Product Discountable",
      mapTo: "product.discountable",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.discountable?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product External ID": {
    importDescriptor: {
      name: "Product External ID",
      mapTo: "product.external_id",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.external_id ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-PROFILE

  "Product Profile Name": {
    exportDescriptor: {
      accessor: (product: Product): string => product?.profile?.name ?? "",
      entityName: "product",
    },
  },

  "Product Profile Type": {
    exportDescriptor: {
      accessor: (product: Product): string => product?.profile?.type ?? "",
      entityName: "product",
    },
  },

  // VARIANTS

  "Variant id": {
    importDescriptor: {
      name: "Variant id",
      mapTo: "variant.id",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.id ?? "",
      entityName: "variant",
    },
  },
  "Variant Title": {
    importDescriptor: {
      name: "Variant Title",
      mapTo: "variant.title",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.title ?? "",
      entityName: "variant",
    },
  },
  "Variant SKU": {
    importDescriptor: {
      name: "Variant SKU",
      mapTo: "variant.sku",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.sku ?? "",
      entityName: "variant",
    },
  },
  "Variant Barcode": {
    importDescriptor: {
      name: "Variant Barcode",
      mapTo: "variant.barcode",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.barcode ?? "",
      entityName: "variant",
    },
  },
  "Variant Inventory Quantity": {
    importDescriptor: {
      name: "Variant Inventory Quantity",
      mapTo: "variant.inventory_quantity",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.inventory_quantity?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Allow backorder": {
    importDescriptor: {
      name: "Variant Allow backorder",
      mapTo: "variant.allow_backorder",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.allow_backorder?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Manage inventory": {
    importDescriptor: {
      name: "Variant Manage inventory",
      mapTo: "variant.manage_inventory",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.manage_inventory?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Weight": {
    importDescriptor: {
      name: "Variant Weight",
      mapTo: "variant.weight",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.weight?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Length": {
    importDescriptor: {
      name: "Variant Length",
      mapTo: "variant.length",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.length?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Width": {
    importDescriptor: {
      name: "Variant Width",
      mapTo: "variant.width",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.width?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Height": {
    importDescriptor: {
      name: "Variant Height",
      mapTo: "variant.height",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.height?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant HS Code": {
    importDescriptor: {
      name: "Variant HS Code",
      mapTo: "variant.hs_code",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.hs_code?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Origin Country": {
    importDescriptor: {
      name: "Variant Origin Country",
      mapTo: "variant.origin_country",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.origin_country?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant MID Code": {
    importDescriptor: {
      name: "Variant MID Code",
      mapTo: "variant.mid_code",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.mid_code?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Material": {
    importDescriptor: {
      name: "Variant Material",
      mapTo: "variant.material",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.material?.toString() ?? "",
      entityName: "variant",
    },
  },

  // ==== DYNAMIC FIELDS ====

  // PRODUCT_OPTIONS

  "Option Name": {
    importDescriptor: {
      name: "Option Name",
      match: /Option \d+ Name/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.options"] = builtLine["product.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const options = builtLine["product.options"] as Record<
          string,
          string | number
        >[]

        options.push({ title: value })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Option ${index + 1} Name`
      },
    },
  },
  "Option Value": {
    importDescriptor: {
      name: "Option Value",
      match: /Option \d+ Value/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key: string,
        value: string,
        context: any
      ): TBuiltProductImportLine => {
        builtLine["variant.options"] = builtLine["variant.options"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const options = builtLine["variant.options"] as Record<
          string,
          string | number
        >[]

        options.push({
          value,
          _title: context.line[key.slice(0, -6) + " Name"],
        })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Option ${index + 1} Value`
      },
    },
  },

  // PRICES

  "Price Region": {
    importDescriptor: {
      name: "Price Region",
      match: /Price (.*) \[([A-Z]{3})\]/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key,
        value
      ): TBuiltProductImportLine => {
        builtLine["variant.prices"] = builtLine["variant.prices"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const [, regionName] =
          key.trim().match(/Price (.*) \[([A-Z]{3})\]/) || []
        ;(
          builtLine["variant.prices"] as Record<string, string | number>[]
        ).push({
          amount: parseFloat(value),
          regionName,
        })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (data: ProductExportPriceData) => {
        return `Price ${data.region?.name} ${
          data.region?.currency_code
            ? "[" + data.region?.currency_code.toUpperCase() + "]"
            : ""
        }`
      },
    },
  },
  "Price Currency": {
    importDescriptor: {
      name: "Price Currency",
      match: /Price [A-Z]{3}/,
      reducer: (
        builtLine: TParsedProductImportRowData,
        key,
        value
      ): TBuiltProductImportLine => {
        builtLine["variant.prices"] = builtLine["variant.prices"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const currency = key.trim().split(" ")[1]

        ;(
          builtLine["variant.prices"] as Record<string, string | number>[]
        ).push({
          amount: parseFloat(value),
          currency_code: currency,
        })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (data: ProductExportPriceData) => {
        return `Price ${data.currency_code?.toUpperCase()}`
      },
    },
  },
  // IMAGES
  "Image Url": {
    importDescriptor: {
      name: "Image Url",
      match: /Image \d+ Url/,
      reducer: (builtLine: any, key, value): TBuiltProductImportLine => {
        builtLine["product.images"] = builtLine["product.images"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        builtLine["product.images"].push(value)

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Image ${index + 1} Url`
      },
    },
  },
}

export const productSalesChannelColumnsDefinition: ProductColumnDefinition = {
  "Sales Channel Name": {
    importDescriptor: {
      name: "Sales Channel Name",
      match: /Sales Channel \d+ Name/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.sales_channels"] =
          builtLine["product.sales_channels"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const channels = builtLine["product.sales_channels"] as Record<
          string,
          string | number
        >[]

        channels.push({
          name: value,
        })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Sales channel ${index + 1} Name`
      },
    },
  },
  "Sales Channel Description": {
    importDescriptor: {
      name: "Sales Channel Description",
      match: /Sales Channel \d+ Description/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.sales_channels"] =
          builtLine["product.sales_channels"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const channels = builtLine["product.sales_channels"] as Record<
          string,
          string | number
        >[]

        channels.push({
          description: value,
        })

        return builtLine
      },
    },
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Sales channel ${index + 1} Description`
      },
    },
  },
  "Sales Channel Id": {
    importDescriptor: {
      name: "Sales Channel Id",
      match: /Sales Channel \d+ Id/,
      reducer: (builtLine, key, value): TBuiltProductImportLine => {
        builtLine["product.sales_channels"] =
          builtLine["product.sales_channels"] || []

        if (typeof value === "undefined" || value === null) {
          return builtLine
        }

        const channels = builtLine["product.sales_channels"] as Record<
          string,
          string | number
        >[]

        channels.push({
          id: value,
        })

        return builtLine
      },
    },
  },
}

export const productImportColumnsDefinition: CsvSchema<
  TParsedProductImportRowData,
  TBuiltProductImportLine
> = {
  columns: Object.values(productColumnsDefinition)
    .map((def) => ({ ...def.importDescriptor }))
    .filter(
      (
        v
      ): v is CsvSchemaColumn<
        TParsedProductImportRowData,
        TBuiltProductImportLine
      > => {
        return !!v
      }
    ),
}

export const productImportSalesChannelsColumnsDefinition: CsvSchema<
  TParsedProductImportRowData,
  TBuiltProductImportLine
> = {
  columns: Object.values(productSalesChannelColumnsDefinition)
    .map((def) => ({ ...def.importDescriptor }))
    .filter(
      (
        v
      ): v is CsvSchemaColumn<
        TParsedProductImportRowData,
        TBuiltProductImportLine
      > => {
        return !!v
      }
    ),
}
