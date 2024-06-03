import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, Heading, Input, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useEffect, useMemo, useState } from "react"
import { ChipGroup } from "../../../../../components/common/chip-group"
import { Form } from "../../../../../components/common/form"
import { InlineTip } from "../../../../../components/common/inline-tip"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { DataTable } from "../../../../../components/table/data-table"
import { useCreateFulfillmentSetServiceZone } from "../../../../../hooks/api/fulfillment-sets"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { countries as staticCountries } from "../../../../../lib/countries"
import { useCountries } from "../../../../regions/common/hooks/use-countries"
import { useCountryTableColumns } from "../../../../regions/common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../../regions/common/hooks/use-country-table-query"

const CreateServiceZoneSchema = z.object({
  name: z.string().min(1),
  countries: z
    .array(z.object({ iso_2: z.string().min(2), display_name: z.string() }))
    .min(1),
})

type CreateServiceZoneFormProps = {
  fulfillmentSet: HttpTypes.AdminFulfillmentSet
}

export function CreateServiceZoneForm({
  fulfillmentSet,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      countries: [],
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const { fields, remove, replace } = useFieldArray({
    control: form.control,
    name: "countries",
    keyName: "iso_2",
  })

  const handleClearAll = () => {
    replace([])
  }

  const { mutateAsync, isPending } = useCreateFulfillmentSetServiceZone(
    fulfillmentSet.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        geo_zones: data.countries.map(({ iso_2 }) => ({
          country_code: iso_2,
          type: "country",
        })),
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            description: t("location.serviceZone.create.successToast", {
              name: data.name,
            }),
            dismissable: true,
            dismissLabel: t("general.close"),
          })

          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissable: true,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="m-auto flex h-full w-full  flex-col items-center divide-y overflow-hidden">
          <SplitView open={open} onOpenChange={setOpen}>
            <SplitView.Content>
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <Heading>
                    {t("location.serviceZone.create.title", {
                      fulfillmentSet: fulfillmentSet.name,
                    })}
                  </Heading>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Form.Field
                      control={form.control}
                      name="name"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>{t("fields.name")}</Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>

                  <InlineTip label={"Info"}>
                    {t("location.serviceZone.create.description")}
                  </InlineTip>

                  <Form.Field
                    control={form.control}
                    name="countries"
                    render={() => {
                      return (
                        <Form.Item>
                          <div className="flex items-start justify-between gap-x-4">
                            <div>
                              <Form.Label>
                                {t("location.serviceZone.areas.title")}
                              </Form.Label>
                              <Form.Hint>
                                {t("location.serviceZone.areas.description")}
                              </Form.Hint>
                            </div>
                            <Button
                              size="small"
                              variant="secondary"
                              type="button"
                              onClick={() => setOpen(true)}
                            >
                              {t("location.serviceZone.areas.manage")}
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
                                  <ChipGroup.Chip
                                    key={field.iso_2}
                                    index={index}
                                  >
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
                </div>
              </div>
            </SplitView.Content>
            <AreasDrawer form={form} open={open} onOpenChange={setOpen} />
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

type AreasDrawerProps = {
  form: UseFormReturn<z.infer<typeof CreateServiceZoneSchema>>
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PREFIX = "ac"
const PAGE_SIZE = 50

const AreasDrawer = ({ form, open, onOpenChange }: AreasDrawerProps) => {
  const { t } = useTranslation()
  const { getValues, setValue } = form

  const [selection, setSelection] = useState<RowSelectionState>({})
  const [state, setState] = useState<{ iso_2: string; display_name: string }[]>(
    []
  )

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
      region: {} as HttpTypes.AdminRegion,
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

    let addedCountries: { iso_2: string; display_name: string }[] = []

    if (addedIdsSet.size > 0) {
      addedCountries =
        countries?.filter((country) => addedIdsSet.has(country.iso_2)) ?? []
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

const columnHelper = createColumnHelper<HttpTypes.AdminRegionCountry>()

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
  ) as ColumnDef<HttpTypes.AdminRegionCountry>[]
}
