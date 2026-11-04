import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

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

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

export const useProductTableColumns = () => {
  const { canRead: canReadSalesChannels } = useSalesChannelPermissions()
  const { canRead: canReadVariants } = useProductVariantPermissions()
  const { canRead: canReadCollections } = useProductCollectionPermissions()

  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => <ProductCell product={row.original} />,
      }),
      ...(canReadCollections
        ? [
            columnHelper.accessor("collection", {
              header: () => <CollectionHeader />,
              cell: ({ row }) => (
                <CollectionCell collection={row.original.collection} />
              ),
            }),
          ]
        : []),
      ...(canReadSalesChannels
        ? [
            columnHelper.accessor("sales_channels", {
              header: () => <SalesChannelHeader />,
              cell: ({ row }) => (
                <SalesChannelsCell
                  salesChannels={row.original.sales_channels}
                />
              ),
            }),
          ]
        : []),
      ...(canReadVariants
        ? [
            columnHelper.accessor("variants", {
              header: () => <VariantHeader />,
              cell: ({ row }) => (
                <VariantCell variants={row.original.variants} />
              ),
            }),
          ]
        : []),
      columnHelper.accessor("status", {
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      }),
    ],
    []
  )
}
