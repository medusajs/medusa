import { Region } from "@medusajs/medusa"
import { Container, Heading, usePrompt } from "@medusajs/ui"
import {
  useAdminDeleteShippingOption,
  useAdminShippingOptions,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import { PencilSquare, PlusMini, Trash } from "@medusajs/icons"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useShippingOptionTableColumns } from "../../../../../hooks/table/columns/use-shipping-option-table-columns"
import { useShippingOptionTableFilters } from "../../../../../hooks/table/filters/use-shipping-option-table-filters"
import { useShippingOptionTableQuery } from "../../../../../hooks/table/query/use-shipping-option-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type RegionShippingOptionSectionProps = {
  region: Region
}

const PAGE_SIZE = 10

export const RegionShippingOptionSection = ({
  region,
}: RegionShippingOptionSectionProps) => {
  const { searchParams, raw } = useShippingOptionTableQuery({
    pageSize: PAGE_SIZE,
    regionId: region.id,
  })
  const { shipping_options, count, isError, error, isLoading } =
    useAdminShippingOptions(
      {
        ...searchParams,
      },
      {
        keepPreviousData: true,
      }
    )

  const filters = useShippingOptionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: (shipping_options ?? []) as unknown as PricedShippingOption[],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id!,
    pageSize: PAGE_SIZE,
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("regions.shippingOptions")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.create"),
                  icon: <PlusMini />,
                  to: "shipping-options/create",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        filters={filters}
        orderBy={[
          "name",
          "price_type",
          "price_incl_tax",
          "is_return",
          "admin_only",
          "created_at",
          "updated_at",
        ]}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        pagination
        search
        queryObject={raw}
      />
    </Container>
  )
}

const ShippingOptionActions = ({
  shippingOption,
}: {
  shippingOption: PricedShippingOption
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteShippingOption(shippingOption.id!)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.deleteShippingOptionWarning", {
        name: shippingOption.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `shipping-options/${shippingOption.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<PricedShippingOption>()

const useColumns = () => {
  const base = useShippingOptionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ShippingOptionActions shippingOption={row.original} />
        },
      }),
    ],
    [base]
  )
}
