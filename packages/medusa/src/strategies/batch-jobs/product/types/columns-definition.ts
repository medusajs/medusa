import { Product, ProductVariant } from "../../../../models"
import {
  ProductColumnDefinition,
  ProductExportPriceData,
  TBuiltProductImportLine,
  TParsedProductImportRowData,
} from "./index"
import { CsvSchema, CsvSchemaColumn } from "../../../../interfaces/csv-parser"

export const productColumnsDefinition: ProductColumnDefinition = {
  "Product Id": {
    name: "Product Id",
    importDescriptor: {
      mapTo: "product.id",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.id ?? "",
      entityName: "product",
    },
  },
  "Product Handle": {
    name: "Product Handle",
    importDescriptor: {
      mapTo: "product.handle",
      required: true,
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.handle ?? "",
      entityName: "product",
    },
  },
  "Product Title": {
    name: "Product Title",
    importDescriptor: {
      mapTo: "product.title",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.title ?? "",
      entityName: "product",
    },
  },
  "Product Subtitle": {
    name: "Product Subtitle",
    importDescriptor: {
      mapTo: "product.subtitle",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.subtitle ?? "",
      entityName: "product",
    },
  },
  "Product Description": {
    name: "Product Description",
    importDescriptor: {
      mapTo: "product.description",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.description ?? "",
      entityName: "product",
    },
  },
  "Product Status": {
    name: "Product Status",
    importDescriptor: {
      mapTo: "product.status",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.status ?? "",
      entityName: "product",
    },
  },
  "Product Thumbnail": {
    name: "Product Thumbnail",
    importDescriptor: {
      mapTo: "product.thumbnail",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.thumbnail ?? "",
      entityName: "product",
    },
  },
  "Product Weight": {
    name: "Product Weight",
    importDescriptor: {
      mapTo: "product.weight",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.weight?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Length": {
    name: "Product Length",
    importDescriptor: {
      mapTo: "product.length",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.length?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Width": {
    name: "Product Width",
    importDescriptor: {
      mapTo: "product.width",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.width?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Height": {
    name: "Product Height",
    importDescriptor: {
      mapTo: "product.height",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.height?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product HS Code": {
    name: "Product HS Code",
    importDescriptor: {
      mapTo: "product.hs_code",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.hs_code?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Origin Country": {
    name: "Product Origin Country",
    importDescriptor: {
      mapTo: "product.origin_country",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.origin_country?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product MID Code": {
    name: "Product MID Code",
    importDescriptor: {
      mapTo: "product.mid_code",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.mid_code?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product Material": {
    name: "Product Material",
    importDescriptor: {
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
    name: "Product Collection Title",
    importDescriptor: {
      mapTo: "product.collection.title",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.collection?.title ?? "",
      entityName: "product",
    },
  },
  "Product Collection Handle": {
    name: "Product Collection Handle",
    importDescriptor: {
      mapTo: "product.collection.handle",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.collection?.handle ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-TYPE

  "Product Type": {
    name: "Product Type",
    importDescriptor: {
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
    name: "Product Tags",
    importDescriptor: {
      mapTo: "product.tags",
      transform: (value: string) => {
        return value && `${value}`.split(",").map((v) => ({ value: v }))
      },
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        (product.tags.map((t) => t.value) ?? []).join(","),
      entityName: "product",
    },
  },

  //

  "Product Discountable": {
    name: "Product Discountable",
    importDescriptor: {
      mapTo: "product.discountable",
    },
    exportDescriptor: {
      accessor: (product: Product): string =>
        product?.discountable?.toString() ?? "",
      entityName: "product",
    },
  },
  "Product External Id": {
    name: "Product External Id",
    importDescriptor: {
      mapTo: "product.external_id",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.external_id ?? "",
      entityName: "product",
    },
  },

  // PRODUCT-PROFILE

  "Product Profile Name": {
    name: "Product Profile Name",
    importDescriptor: {
      mapTo: "__not_supported__",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.profile?.name ?? "",
      entityName: "product",
    },
  },

  "Product Profile Type": {
    name: "Product Profile Type",
    importDescriptor: {
      mapTo: "__not_supported__",
    },
    exportDescriptor: {
      accessor: (product: Product): string => product?.profile?.type ?? "",
      entityName: "product",
    },
  },

  // VARIANTS

  "Variant Id": {
    name: "Variant Id",
    importDescriptor: {
      mapTo: "variant.id",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.id ?? "",
      entityName: "variant",
    },
  },
  "Variant Title": {
    name: "Variant Title",

    importDescriptor: {
      mapTo: "variant.title",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.title ?? "",
      entityName: "variant",
    },
  },
  "Variant SKU": {
    name: "Variant SKU",

    importDescriptor: {
      mapTo: "variant.sku",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.sku ?? "",
      entityName: "variant",
    },
  },
  "Variant Barcode": {
    name: "Variant Barcode",

    importDescriptor: {
      mapTo: "variant.barcode",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string => variant?.barcode ?? "",
      entityName: "variant",
    },
  },
  "Variant Inventory Quantity": {
    name: "Variant Inventory Quantity",

    importDescriptor: {
      mapTo: "variant.inventory_quantity",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.inventory_quantity?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Allow Backorder": {
    name: "Variant Allow Backorder",

    importDescriptor: {
      mapTo: "variant.allow_backorder",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.allow_backorder?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Manage Inventory": {
    name: "Variant Manage Inventory",
    importDescriptor: {
      mapTo: "variant.manage_inventory",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.manage_inventory?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Weight": {
    name: "Variant Weight",

    importDescriptor: {
      mapTo: "variant.weight",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.weight?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Length": {
    name: "Variant Length",

    importDescriptor: {
      mapTo: "variant.length",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.length?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Width": {
    name: "Variant Width",
    importDescriptor: {
      mapTo: "variant.width",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.width?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Height": {
    name: "Variant Height",
    importDescriptor: {
      mapTo: "variant.height",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.height?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant HS Code": {
    name: "Variant HS Code",
    importDescriptor: {
      mapTo: "variant.hs_code",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.hs_code?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Origin Country": {
    name: "Variant Origin Country",
    importDescriptor: {
      mapTo: "variant.origin_country",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.origin_country?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant MID Code": {
    name: "Variant MID Code",
    importDescriptor: {
      mapTo: "variant.mid_code",
    },
    exportDescriptor: {
      accessor: (variant: ProductVariant): string =>
        variant?.mid_code?.toString() ?? "",
      entityName: "variant",
    },
  },
  "Variant Material": {
    name: "Variant Material",
    importDescriptor: {
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
    name: "Option Name",
    importDescriptor: {
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
    name: "Option Value",
    importDescriptor: {
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
    name: "Price Region",
    importDescriptor: {
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
    name: "Price Currency",
    importDescriptor: {
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
    name: "Image Url",
    importDescriptor: {
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
    name: "Sales Channel Name",
    importDescriptor: {
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
        return `Sales Channel ${index + 1} Name`
      },
    },
  },
  "Sales Channel Description": {
    name: "Sales Channel Description",
    importDescriptor: {
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
        return `Sales Channel ${index + 1} Description`
      },
    },
  },
  "Sales Channel Id": {
    name: "Sales Channel Id",
    importDescriptor: {
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
    exportDescriptor: {
      isDynamic: true,
      buildDynamicColumnName: (index: number) => {
        return `Sales Channel ${index + 1} Id`
      },
    },
  },
}

export const productImportColumnsDefinition: CsvSchema<
  TParsedProductImportRowData,
  TBuiltProductImportLine
> = {
  columns: Object.entries(productColumnsDefinition)
    .map(([name, def]) => {
      return def.importDescriptor && { name, ...def.importDescriptor }
    })
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
  columns: Object.entries(productSalesChannelColumnsDefinition)
    .map(([name, def]) => {
      return def.importDescriptor && { name, ...def.importDescriptor }
    })
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
