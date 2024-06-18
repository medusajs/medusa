import { Trash } from "@medusajs/icons"
import { AdminTaxRegionResponse } from "@medusajs/types"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { t } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  useDeleteTaxRegion,
  useTaxRegions,
} from "../../../../../hooks/api/tax-regions"
import { useTaxRegionTableQuery } from "../../../../../hooks/table/query/use-tax-region-table-query copy"
import { getCountryByIso2 } from "../../../../../lib/data/countries"
import { TaxRegionCard } from "../../../common/components/tax-region-card"

const PAGE_SIZE = 20

export const TaxRegionListView = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useTaxRegionTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { tax_regions, count, isLoading, isError, error } = useTaxRegions(
    {
      ...searchParams,
      parent_id: "null",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>{t("taxes.domain")}</Heading>
          <Button size="small" variant="secondary" asChild>
            <Link to="/settings/taxes/create">{t("actions.create")}</Link>
          </Button>
        </div>
      </Container>
      <Container className="divide-y p-0">
        {tax_regions?.map((taxRegion) => (
          <TaxRegionCard key={taxRegion.id} taxRegion={taxRegion} />
        ))}
      </Container>
    </div>
  )
}

const TaxRegionActions = ({
  taxRegion,
}: {
  taxRegion: AdminTaxRegionResponse["tax_region"]
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync } = useDeleteTaxRegion(taxRegion.id)

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/settings/taxes", { replace: true })
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<AdminTaxRegionResponse["tax_region"]>()

const useColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("country_code", {
        header: t("fields.country"),
        cell: ({ getValue }) => {
          const countryCode = getValue()
          const displayName =
            getCountryByIso2(countryCode)?.display_name || countryCode

          return (
            <div className="flex size-full items-center">
              <span className="truncate">{displayName}</span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <TaxRegionActions taxRegion={row.original as any} />
        },
      }),
    ],
    []
  )
}
