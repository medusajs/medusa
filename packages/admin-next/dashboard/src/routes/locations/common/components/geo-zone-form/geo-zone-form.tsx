import { Button, Checkbox } from "@medusajs/ui"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { ChipGroup } from "../../../../../components/common/chip-group"
import { Form } from "../../../../../components/common/form"
import { SplitView } from "../../../../../components/layout/split-view"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import {
  StaticCountry,
  countries as staticCountries,
} from "../../../../../lib/countries"
import { useCountries } from "../../../../regions/common/hooks/use-countries"
import { useCountryTableColumns } from "../../../../regions/common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../../regions/common/hooks/use-country-table-query"

const GeoZoneSchema = z.object({
  countries: z.array(
    z.object({ iso_2: z.string().min(2), display_name: z.string() })
  ),
})

type GeoZoneFormImplProps<TForm extends UseFormReturn<any>> = {
  form: TForm
  onOpenChange: (open: boolean) => void
}

const GeoZoneFormImpl = <TForm extends UseFormReturn<any>>({
  form,
  onOpenChange,
}: GeoZoneFormImplProps<TForm>) => {
  const castForm = form as unknown as UseFormReturn<
    z.infer<typeof GeoZoneSchema>
  >

  const { t } = useTranslation()

  const { fields, remove, replace } = useFieldArray({
    control: castForm.control,
    name: "countries",
    keyName: "iso_2",
  })

  const handleClearAll = () => {
    replace([])
  }

  validateForm(form)

  return (
    <Form.Field
      control={form.control}
      name="countries"
      render={() => {
        return (
          <Form.Item>
            <div className="flex items-center justify-between gap-x-4">
              <div>
                <Form.Label>
                  {t("stockLocations.serviceZones.manageAreas.label")}
                </Form.Label>
                <Form.Hint>
                  {t("stockLocations.serviceZones.manageAreas.hint")}
                </Form.Hint>
              </div>
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={() => onOpenChange(true)}
              >
                {t("stockLocations.serviceZones.manageAreas.action")}
              </Button>
            </div>
            <Form.ErrorMessage />
            <Form.Control className="mt-0">
              {fields.length > 0 && (
                <ChipGroup
                  onClearAll={handleClearAll}
                  onRemove={remove}
                  className="py-4"
                >
                  {fields.map((field, index) => (
                    <ChipGroup.Chip key={field.iso_2} index={index}>
                      {field.display_name}
                    </ChipGroup.Chip>
                  ))}
                </ChipGroup>
              )}
            </Form.Control>
          </Form.Item>
        )
      }}
    />
  )
}

type AreasDrawerProps<TForm extends UseFormReturn<any>> = {
  form: TForm
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PREFIX = "ac"
const PAGE_SIZE = 50

const AreaDrawer = <TForm extends UseFormReturn<any>>({
  form,
  open,
  onOpenChange,
}: AreasDrawerProps<TForm>) => {
  const castForm = form as unknown as UseFormReturn<
    z.infer<typeof GeoZoneSchema>
  >

  const { t } = useTranslation()
  const { getValues, setValue } = castForm

  const [selection, setSelection] = useState<RowSelectionState>({})
  const [state, setState] = useState<{ iso_2: string; display_name: string }[]>(
    []
  )

  const { searchParams, raw } = useCountryTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { countries, count } = useCountries({
    countries: staticCountries.map((c) => ({
      display_name: c.display_name,
      name: c.name,
      iso_2: c.iso_2,
      iso_3: c.iso_3,
      num_code: c.num_code,
    })),
    ...searchParams,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    const countries = getValues("countries")

    if (countries) {
      setState(
        countries.map((country) => ({
          iso_2: country.iso_2,
          display_name: country.display_name,
        }))
      )

      setSelection(
        countries.reduce(
          (acc, country) => ({
            ...acc,
            [country.iso_2]: true,
          }),
          {}
        )
      )
    }
  }, [open, getValues])

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const value = typeof fn === "function" ? fn(selection) : fn
    const ids = Object.keys(value)

    const addedIdsSet = new Set(ids.filter((id) => value[id] && !selection[id]))

    const addedCountries: { iso_2: string; display_name: string }[] = []

    if (addedIdsSet.size > 0) {
      const countriesToAdd =
        countries?.filter((country) => addedIdsSet.has(country.iso_2!)) ?? []

      for (const country of countriesToAdd) {
        addedCountries.push({
          iso_2: country.iso_2!,
          display_name: country.display_name!,
        })
      }
    }

    setState((prev) => {
      const filteredPrev = prev.filter((country) => value[country.iso_2])
      return Array.from(new Set([...filteredPrev, ...addedCountries]))
    })
    setSelection(value)
  }

  const handleAdd = () => {
    setValue("countries", state, {
      shouldDirty: true,
      shouldTouch: true,
    })
    onOpenChange(false)
  }

  const columns = useColumns()

  const { table } = useDataTable({
    data: countries || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.iso_2!,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: selection,
      updater,
    },
    prefix: PREFIX,
  })

  validateForm(form)

  return (
    <SplitView.Drawer>
      <div className="flex h-full flex-col overflow-hidden">
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
        <div className="flex items-center justify-end gap-x-2 border-t p-4">
          <SplitView.Close type="button" asChild>
            <Button variant="secondary" size="small">
              {t("actions.cancel")}
            </Button>
          </SplitView.Close>
          <Button size="small" type="button" onClick={handleAdd}>
            {t("actions.add")}
          </Button>
        </div>
      </div>
    </SplitView.Drawer>
  )
}

const columnHelper = createColumnHelper<StaticCountry>()

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
  )
}

function validateForm(form: UseFormReturn) {
  if (form.getValues("countries") === undefined) {
    throw new Error(
      "The form does not have a field named 'countries'. This field is required to use the GeoZoneForm component."
    )
  }
}

export const GeoZoneForm = Object.assign(GeoZoneFormImpl, {
  AreaDrawer,
})
