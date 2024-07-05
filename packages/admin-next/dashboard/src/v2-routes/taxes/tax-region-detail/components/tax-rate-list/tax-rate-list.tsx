import { PencilSquare, Trash } from "@medusajs/icons"
import { TaxRateResponse, TaxRegionResponse } from "@medusajs/types"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import {
  useDeleteTaxRate,
  useTaxRates,
} from "../../../../../hooks/api/tax-rates"
import { useDeleteTaxRegion } from "../../../../../hooks/api/tax-regions"
import { useTaxRateTableColumns } from "../../../../../hooks/table/columns/use-tax-rates-table-columns"
import { useTaxRateTableFilters } from "../../../../../hooks/table/filters/use-tax-rate-table-filters"
import { useTaxRateTableQuery } from "../../../../../hooks/table/query/use-tax-rate-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 10

type TaxRateListProps = {
  taxRegion: TaxRegionResponse
  isDefault: boolean
}

export const TaxRateList = ({
  taxRegion,
  isDefault = false,
}: TaxRateListProps) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useTaxRateTableQuery({ pageSize: PAGE_SIZE })
  const childrenIds = taxRegion.children?.map((c) => c.id) || []
  const {
    tax_rates: taxRates,
    count,
    isLoading,
    isError,
    error,
  } = useTaxRates(
    {
      ...searchParams,
      tax_region_id: [taxRegion.id, ...childrenIds],
      is_default: isDefault,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = useTaxRateTableFilters()

  const { table } = useDataTable({
    data: taxRates ?? [],
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
      taxRegionId: taxRegion.id,
    },
  })

  const { mutateAsync } = useDeleteTaxRegion(taxRegion.id)

  const prompt = usePrompt()
  const { t } = useTranslation()

  const handleRemove = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("taxRegions.removeWarning", {
        tax_region_name: taxRegion.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        setRowSelection({})
      },
    })
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {isDefault ? `Default ${t("taxRates.domain")}` : `Tax Rate Overrides`}
        </Heading>

        <Link
          to={
            isDefault
              ? `/settings/taxes/${taxRegion.id}/create-default`
              : `/settings/taxes/${taxRegion.id}/create-override`
          }
        >
          <Button size="small" variant="secondary">
            Create
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
        navigateTo={(row) =>
          `/settings/taxes/${taxRegion.id}/tax-rates/${row.id}/edit`
        }
        isLoading={isLoading}
        orderBy={["is_default", "rate", "created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<TaxRateResponse>()

const useColumns = () => {
  const base = useTaxRateTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { taxRegionId } = table.options.meta as {
            taxRegionId: string
          }

          return (
            <TaxRateListActions
              taxRateId={row.original.id}
              taxRegionId={taxRegionId}
            />
          )
        },
      }),
    ],
    [base]
  )
}

const TaxRateListActions = ({
  taxRateId,
  taxRegionId,
}: {
  taxRateId: string
  taxRegionId: string
}) => {
  const { t } = useTranslation()

  const { mutateAsync } = useDeleteTaxRate(taxRateId)

  const onRemove = async () => await mutateAsync()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/taxes/${taxRegionId}/tax-rates/${taxRateId}/edit`,
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
