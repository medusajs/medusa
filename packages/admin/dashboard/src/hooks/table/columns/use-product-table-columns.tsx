import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../../../components/table/data-table/data-table-features"
import { ReactNode, useMemo } from "react"

import {
  CollectionCell,
  CollectionHeader,
} from "../../../components/table/table-cells/product/collection-cell/collection-cell"
import {
  ProductCell,
  ProductHeader,
} from "../../../components/table/table-cells/product/product-cell"
import {
  ProductStatusCell,
  ProductStatusHeader,
} from "../../../components/table/table-cells/product/product-status-cell"
import {
  SalesChannelHeader,
  SalesChannelsCell,
} from "../../../components/table/table-cells/product/sales-channels-cell"
import {
  VariantCell,
  VariantHeader,
} from "../../../components/table/table-cells/product/variant-cell"
import { HttpTypes } from "@medusajs/types"
import {
  useProductCollectionPermissions,
  useProductVariantPermissions,
  useSalesChannelPermissions,
} from "../../use-resource-permissions"

const columnHelper = createColumnHelper<
  DataTableFeatures,
  HttpTypes.AdminProduct
>()

export type ProductTableColumnDef = {
  id: string
  header: () => ReactNode
  cell: (context: { row: { original: HttpTypes.AdminProduct } }) => ReactNode
}

export const useProductTableColumnDefs = () => {
  const { canRead: canReadSalesChannels } = useSalesChannelPermissions()
  const { canRead: canReadVariants } = useProductVariantPermissions()
  const { canRead: canReadCollections } = useProductCollectionPermissions()

  return useMemo<ProductTableColumnDef[]>(
    () => [
      {
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => <ProductCell product={row.original} />,
      },
      ...(canReadCollections
        ? [
            {
              id: "collection",
              header: () => <CollectionHeader />,
              cell: ({ row }) => (
                <CollectionCell collection={row.original.collection} />
              ),
            },
          ]
        : []),
      ...(canReadSalesChannels
        ? [
            {
              id: "sales_channels",
              header: () => <SalesChannelHeader />,
              cell: ({ row }) => (
                <SalesChannelsCell
                  salesChannels={row.original.sales_channels}
                />
              ),
            },
          ]
        : []),
      ...(canReadVariants
        ? [
            {
              id: "variants",
              header: () => <VariantHeader />,
              cell: ({ row }) => (
                <VariantCell variants={row.original.variants} />
              ),
            },
          ]
        : []),
      {
        id: "status",
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      },
    ],
    [canReadCollections, canReadSalesChannels, canReadVariants]
  )
}

export const useProductTableColumns = () => {
  const columns = useProductTableColumnDefs()

  return useMemo(
    () => columns.map((column) => columnHelper.display(column)),
    [columns]
  )
}
