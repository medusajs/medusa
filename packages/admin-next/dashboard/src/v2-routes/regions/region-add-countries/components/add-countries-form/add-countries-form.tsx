import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Button, Checkbox, toast } from "@medusajs/ui"
import { RegionCountryDTO, RegionDTO } from "@medusajs/types"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { countries as staticCountries } from "../../../../../lib/countries"
import { useCountries } from "../../../common/hooks/use-countries"
import { useCountryTableColumns } from "../../../common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../common/hooks/use-country-table-query"
import { useUpdateRegion } from "../../../../../hooks/api/regions"

type AddCountriesFormProps = {
  region: RegionDTO
}

const AddCountriesSchema = zod.object({
  countries: zod.array(zod.string()).min(1),
})

const PAGE_SIZE = 50
const PREFIX = "ac"

export const AddCountriesForm = ({ region }: AddCountriesFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const form = useForm<zod.infer<typeof AddCountriesSchema>>({
    defaultValues: {
      countries: [],
    },
    resolver: zodResolver(AddCountriesSchema),
  })

  const { setValue } = form

  useEffect(() => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k])

    setValue("countries", ids, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, setValue])

  const { searchParams, raw } = useCountryTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { countries, count } = useCountries({
    countries: staticCountries.map((c, i) => ({
      display_name: c.display_name,
      name: c.name,
      id: i as any,
      iso_2: c.iso_2,
      iso_3: c.iso_3,
      num_code: c.num_code,
      region_id: null,
      region: {} as RegionDTO,
    })),
    ...searchParams,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: countries || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      return (
        region.countries?.findIndex((c) => c.iso_2 === row.original.iso_2) ===
        -1
      )
    },
    getRowId: (row) => row.iso_2,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    prefix: PREFIX,
  })

  const { mutateAsync, isPending: isLoading } = useUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = [
      ...region.countries.map((c) => c.iso_2),
      ...values.countries,
    ]

    try {
      await mutateAsync({
        countries: payload,
      })

      handleSuccess()

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
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" isLoading={isLoading} type="submit">
              {t("actions.add")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            pageSize={PAGE_SIZE}
            count={count}
            search
            pagination
            layout="fill"
            orderBy={["name", "code"]}
            queryObject={raw}
            prefix={PREFIX}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
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
          const isPreselected = !row.getCanSelect()

          return (
            <Checkbox
              checked={row.getIsSelected() || isPreselected}
              disabled={isPreselected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  ) as ColumnDef<RegionCountryDTO>[]
}
