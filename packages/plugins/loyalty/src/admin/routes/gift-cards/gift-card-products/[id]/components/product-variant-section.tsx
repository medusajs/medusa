import { PencilSquare, Trash } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import {
  Badge,
  Container,
  createDataTableColumnHelper,
  DataTableAction,
  Tooltip,
  usePrompt,
} from "@medusajs/ui";
import { keepPreviousData } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { CellContext } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataTable } from "../../../../../components/data-table";
import { useDataTableDateColumns } from "../../../../../components/data-table/helpers/general/use-data-table-date-columns";
import {
  useDeleteVariantLazy,
  useProductVariants,
} from "../../../../../hooks/api/products";
import { useDataTableDateFilters } from "../../../../../hooks/common/use-data-table-date-filters";
import { useQueryParams } from "../../../../../hooks/common/use-query-params";

type ProductVariantSectionProps = {
  product: HttpTypes.AdminProduct;
};

const PAGE_SIZE = 10;
const PREFIX = "pv";

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  const {
    q,
    order,
    offset,
    allow_backorder,
    manage_inventory,
    created_at,
    updated_at,
  } = useQueryParams(
    [
      "q",
      "order",
      "offset",
      "manage_inventory",
      "allow_backorder",
      "created_at",
      "updated_at",
    ],
    PREFIX
  );

  const columns = useColumns(product);
  const filters = useFilters();

  const { variants, count, isPending, isError, error } = useProductVariants(
    product.id,
    {
      q,
      order: order ? order : "variant_rank",
      offset: offset ? parseInt(offset) : undefined,
      limit: PAGE_SIZE,
      allow_backorder: allow_backorder
        ? JSON.parse(allow_backorder)
        : undefined,
      manage_inventory: manage_inventory
        ? JSON.parse(manage_inventory)
        : undefined,
      created_at: created_at ? JSON.parse(created_at) : undefined,
      updated_at: updated_at ? JSON.parse(updated_at) : undefined,
      fields: "title,*options,created_at,updated_at",
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  if (isError) {
    throw error;
  }

  return (
    <Container className="divide-y p-0">
      <DataTable
        data={variants}
        columns={columns}
        filters={filters}
        rowCount={count}
        getRowId={(row) => row.id}
        pageSize={PAGE_SIZE}
        isLoading={isPending}
        heading={"Denominations"}
        emptyState={{
          empty: {
            heading: "No denominations",
            description: "Add a denomination to get started",
          },
        }}
        actions={[
          {
            label: "Edit denominations",
            to: `denominations`,
          },
          {
            label: "Edit prices",
            to: `prices`,
          },
        ]}
        actionMenu={{
          groups: [
            {
              actions: [
                {
                  label: "Edit prices",
                  to: `prices`,
                  icon: <PencilSquare />,
                },
              ],
            },
          ],
        }}
        prefix={PREFIX}
      />
    </Container>
  );
};

const columnHelper =
  createDataTableColumnHelper<HttpTypes.AdminProductVariant>();

const useColumns = (product: HttpTypes.AdminProduct) => {
  const navigate = useNavigate();
  const { mutateAsync } = useDeleteVariantLazy(product.id);
  const prompt = usePrompt();
  const [searchParams] = useSearchParams();

  const tableSearchParams = useMemo(() => {
    const filtered = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith(`${PREFIX}_`)) {
        filtered.append(key, value);
      }
    }
    return filtered;
  }, [searchParams]);

  const dateColumns = useDataTableDateColumns<HttpTypes.AdminProductVariant>();

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      const res = await prompt({
        title: "Are you sure?",
        description: `Are you sure you want to delete denomination ${title}?`,
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (!res) {
        return;
      }

      await mutateAsync({ variantId: id });
    },
    [mutateAsync, prompt]
  );

  const optionColumns = useMemo(() => {
    if (!product?.options) {
      return [];
    }

    return product.options.map((option) => {
      return columnHelper.display({
        id: option.id,
        header: option.title,
        cell: ({ row }) => {
          const variantOpt = row.original.options?.find(
            (opt) => opt.option_id === option.id
          );

          if (!variantOpt) {
            return <span className="text-ui-fg-muted">-</span>;
          }

          return (
            <div className="flex items-center">
              <Tooltip content={variantOpt.value}>
                <Badge
                  size="2xsmall"
                  title={variantOpt.value}
                  className="inline-flex min-w-[20px] max-w-[140px] items-center justify-center overflow-hidden truncate"
                >
                  {variantOpt.value}
                </Badge>
              </Tooltip>
            </div>
          );
        },
      });
    });
  }, [product]);

  const getActions = useCallback(
    (ctx: CellContext<HttpTypes.AdminProductVariant, unknown>) => {
      const variant = ctx.row.original as HttpTypes.AdminProductVariant & {
        inventory_items: { inventory: HttpTypes.AdminInventoryItem }[];
      };

      const mainActions: DataTableAction<HttpTypes.AdminProductVariant>[] = [
        {
          icon: <Trash />,
          label: "Delete",
          onClick: () => handleDelete(variant.id, variant.title!),
        },
      ];

      return [mainActions];
    },
    [handleDelete, navigate, tableSearchParams]
  );

  return useMemo(() => {
    return [
      columnHelper.accessor("title", {
        header: "Title",
        enableSorting: false,
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
      }),
      columnHelper.action({
        actions: getActions,
      }),
    ];
  }, [optionColumns, dateColumns, getActions]);
};

const useFilters = () => {
  const dateFilters = useDataTableDateFilters();

  return useMemo(() => {
    return [];
  }, [dateFilters]);
};
