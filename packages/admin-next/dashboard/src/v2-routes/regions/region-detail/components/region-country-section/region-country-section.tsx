import { PlusMini, Trash } from "@medusajs/icons"
import { Checkbox, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { RegionCountryDTO, RegionDTO } from "@medusajs/types"
import {
  ColumnDef,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCountries } from "../../../common/hooks/use-countries"
import { useCountryTableColumns } from "../../../common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../common/hooks/use-country-table-query"
import { useUpdateRegion } from "../../../../../hooks/api/regions"

type RegionCountrySectionProps = {
  region: RegionDTO
}

const PREFIX = "c"
const PAGE_SIZE = 10

export const RegionCountrySection = ({ region }: RegionCountrySectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useCountryTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { countries, count } = useCountries({
    countries: region.countries || [],
    ...searchParams,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: countries || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.iso_2,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    prefix: PREFIX,
    meta: {
      region,
    },
  })

  const { mutateAsync } = useUpdateRegion(region.id)

  const handleRemoveCountries = async () => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k])

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.removeCountriesWarning", {
        count: ids.length,
      }),
      verificationText: t("actions.remove"),
      verificationInstruction: t("general.typeToConfirm"),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.remove"),
    })

    if (!res) {
      return
    }

    const payload = region.countries
      .filter((c) => !ids.includes(c.iso_2))
      .map((c) => c.iso_2)

    try {
      await mutateAsync({
        countries: payload,
      })

      toast.success(t("general.success"), {
        description: t("regions.toast.countries"),
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
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("fields.countries")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("regions.addCountries"),
                  icon: <PlusMini />,
                  to: "countries/add",
                },
              ],
            },
          ]}
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        orderBy={["name", "code"]}
        search
        pagination
        queryObject={raw}
        prefix={PREFIX}
        commands={[
          {
            action: handleRemoveCountries,
            label: t("actions.remove"),
            shortcut: "r",
          },
        ]}
      />
    </Container>
  )
}

const CountryActions = ({
  country,
  region,
}: {
  country: RegionCountryDTO
  region: RegionDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useUpdateRegion(region.id)

  const payload = region.countries
    ?.filter((c) => c.iso_2 !== country.iso_2)
    .map((c) => c.iso_2)

  const handleRemove = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.removeCountryWarning", {
        name: country.display_name,
      }),
      verificationText: country.display_name,
      verificationInstruction: t("general.typeToConfirm"),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.remove"),
    })

    if (!res) {
      return
    }

    try {
      await mutateAsync({
        countries: payload,
      })

      toast.success(t("general.success"), {
        description: t("regions.toast.countries"),
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
              label: t("actions.remove"),
              onClick: handleRemove,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<RegionCountryDTO>()

const useColumns = () => {
  const base = useCountryTableColumns()

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
          const { region } = table.options.meta as { region: RegionDTO }

          return <CountryActions country={row.original} region={region} />
        },
      }),
    ],
    [base]
  ) as ColumnDef<RegionCountryDTO>[]
}
