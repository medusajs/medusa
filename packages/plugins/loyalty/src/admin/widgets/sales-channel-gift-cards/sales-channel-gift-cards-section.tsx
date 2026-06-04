import { PencilSquare, Trash } from "@medusajs/icons";
import { AdminSalesChannel, HttpTypes } from "@medusajs/types";
import { Checkbox, Container, toast, usePrompt } from "@medusajs/ui";
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionMenu } from "../../components/action-menu";
import { DataTable } from "../../components/data-table";
import { useProducts } from "../../hooks/api/products";
import { useSalesChannelRemoveProducts } from "../../hooks/api/sales-channels";
import { useGeneralEmptyState } from "../../hooks/common/use-general-empty-state";
import { useGiftCardProductsFilters } from "../../hooks/query/use-gift-card-products-filters";
import { useProductTableColumns } from "./use-gift-card-products-table-columns";
import { useGiftCardProductsTableQuery } from "./use-gift-card-products-table-query";

const PAGE_SIZE = 10;

type SalesChannelGiftCardsSectionProps = {
  salesChannel: AdminSalesChannel;
};

export const SalesChannelGiftCardsSection = ({
  salesChannel,
}: SalesChannelGiftCardsSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { searchParams, raw } = useGiftCardProductsTableQuery({
    pageSize: PAGE_SIZE,
  });

  const {
    products,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useProducts({
    ...searchParams,
    sales_channel_id: [salesChannel.id],
    is_giftcard: true,
  });
  const columns = useColumns({ salesChannel });
  const filters = useGiftCardProductsFilters();
  const { mutateAsync } = useSalesChannelRemoveProducts(salesChannel.id);
  const prompt = usePrompt();

  const handleRemove = async () => {
    const ids = Object.keys(rowSelection);

    const result = await prompt({
      title: "Are you sure?",
      description: `Are you sure you want to remove ${ids.length} gift card products from ${salesChannel.name}?`,
      confirmText: "Remove",
      cancelText: "Cancel",
    });

    if (!result) {
      return;
    }

    await mutateAsync(ids, {
      onSuccess: () => {
        toast.success("Gift card product(s) removed");
        setRowSelection({});
      },
      onError: (error: { message: string }) => {
        toast.error(error.message);
      },
    });
  };

  if (isError) {
    throw error;
  }

  const emptyState = useGeneralEmptyState();

  return (
    <Container className="divide-y p-0">
      <DataTable
        heading="Gift Card Products"
        data={products ?? []}
        columns={columns}
        pageSize={PAGE_SIZE}
        commands={[
          {
            action: handleRemove,
            label: "Remove",
            shortcut: "r",
          },
        ]}
        rowCount={count}
        pagination
        search
        rowHref={(row: any) =>
          `/gift-cards/gift-card-products/${row.original.id}`
        }
        filters={filters}
        navigateTo={(row: HttpTypes.AdminProduct) => `/products/${row.id}`}
        isLoading={isLoading}
        orderBy={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status" },
          { key: "created_at", label: "Created At" },
          { key: "updated_at", label: "Updated At" },
        ]}
        queryObject={raw}
        emptyState={emptyState}
        actions={[
          {
            label: "Add",
            to: `/gift-cards/gift-card-products/${salesChannel.id}/add-gift-card-products`,
          },
        ]}
      />
    </Container>
  );
};

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>();

const useColumns = ({ salesChannel }: { salesChannel: AdminSalesChannel }) => {
  const base = useProductTableColumns();

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.getRowModel().rows.forEach((row) => {
                  row.toggleSelected(!!value);
                })
              }
            />
          );
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          );
        },
      }),
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-end">
              <ProductListCellActions
                productId={row.original.id}
                salesChannelId={salesChannel.id}
              />
            </div>
          );
        },
      }),
    ],
    [base]
  );
};

const ProductListCellActions = ({
  salesChannelId,
  productId,
}: {
  productId: string;
  salesChannelId: string;
}) => {
  const { mutateAsync } = useSalesChannelRemoveProducts(salesChannelId);

  const onRemove = async () => {
    await mutateAsync([productId], {
      onSuccess: () => {
        toast.success("Gift card product(s) removed");
      },
      onError: (e: { message: string }) => {
        toast.error(e.message);
      },
    });
  };

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: "Edit",
              to: `/gift-cards/gift-card-products/${productId}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: "Remove",
              onClick: onRemove,
            },
          ],
        },
      ]}
    />
  );
};
