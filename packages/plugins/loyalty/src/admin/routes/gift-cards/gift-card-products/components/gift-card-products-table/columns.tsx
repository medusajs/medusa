import { HttpTypes } from "@medusajs/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  ProductCell,
  ProductHeader,
} from "../../../../../components/product/product-cell";
import {
  ProductStatusCell,
  ProductStatusHeader,
} from "../../../../../components/product/product-status-cell";
import {
  SalesChannelHeader,
  SalesChannelsCell,
} from "../../../../../components/product/sales-channels-cell";
import {
  VariantCell,
  VariantHeader,
} from "../../../../../components/product/variant-cell";

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>();

export const useGiftCardProductsTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => <ProductCell product={row.original} />,
      }),
      columnHelper.accessor("sales_channels", {
        header: () => <SalesChannelHeader />,
        cell: ({ row }) => (
          <SalesChannelsCell salesChannels={row.original.sales_channels} />
        ),
      }),
      columnHelper.accessor("variants", {
        header: () => <VariantHeader />,
        cell: ({ row }) => <VariantCell variants={row.original.variants} />,
      }),
      columnHelper.accessor("status", {
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      }),
    ],
    []
  );
};
