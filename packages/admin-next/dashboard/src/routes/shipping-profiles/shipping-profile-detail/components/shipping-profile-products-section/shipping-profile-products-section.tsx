import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminShippingProfileResponse, HttpTypes } from "@medusajs/types"

import {
  Button,
  Checkbox,
  Container,
  Heading,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { keepPreviousData } from "@tanstack/react-query"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 10

type ShippingProfileGeneralSectionProps = {
  profile: AdminShippingProfileResponse["shipping_profile"]
}

export const ShippingProfileProductsSection = ({
  profile,
}: ShippingProfileGeneralSectionProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const {
    products,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useProducts(
    {
      ...searchParams,
      // profile_id: [profile.id], // TODO: filter products by profile id
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useProductTableFilters(["profile_id"])

  const { table } = useDataTable({
    data: products ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      profileId: profile.id,
    },
  })

  const { mutateAsync } = {} //useSalesChannelRemoveProducts(profile.id)

  const prompt = usePrompt()
  const { t } = useTranslation()

  const handleRemove = async () => {
    const ids = Object.keys(rowSelection)

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("shippingProfile.removeProductsWarning", {
        count: ids.length,
        shipping_profile: profile.label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        product_ids: ids,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("shippingProfile.toast.update"),
            dismissLabel: t("actions.close"),
          })
          setRowSelection({})
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <Link
          to={`/settings/locations/shipping-profiles/${profile.id}/connect-products`}
        >
          <Button size="small" variant="secondary">
            {t("shippingProfile.connectProducts")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        commands={[
          {
            action: handleRemove,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
        count={count}
        pagination
        search
        filters={filters}
        navigateTo={(row) => `/products/${row.id}`}
        isLoading={isLoading}
        orderBy={["title", "variants", "status", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = () => {
  const base = useProductTableColumns()

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
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { profileId } = table.options.meta as {
            profileId: string
          }

          return (
            <ProductListCellActions
              productId={row.original.id}
              profileId={profileId}
            />
          )
        },
      }),
    ],
    [base]
  )
}

const ProductListCellActions = ({
  profileId,
  productId,
}: {
  productId: string
  profileId: string
}) => {
  const { t } = useTranslation()

  const { mutateAsync } = {} // useShippingProfileRemoveProducts(profileId)

  const onRemove = async () => {
    try {
      await mutateAsync({
        product_ids: [productId],
      })
      toast.success(t("general.success"), {
        description: t("salesChannels.toast.update"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${productId}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.remove"),
              onClick: onRemove,
            },
          ],
        },
      ]}
    />
  )
}
