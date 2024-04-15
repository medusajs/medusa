import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ColumnDef,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table"
import * as zod from "zod"

import { Alert, Button, Checkbox, Heading, Input, Text } from "@medusajs/ui"
import { FulfillmentSetDTO, RegionCountryDTO, RegionDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Map } from "@medusajs/icons"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"
import { SplitView } from "../../../../../components/layout/split-view"
import { useCreateServiceZone } from "../../../../../hooks/api/stock-locations"
import { useEffect, useMemo, useState } from "react"
import { useCountryTableQuery } from "../../../../regions/common/hooks/use-country-table-query"
import { useCountries } from "../../../../regions/common/hooks/use-countries"
import { countries as staticCountries } from "../../../../../lib/countries"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCountryTableColumns } from "../../../../regions/common/hooks/use-country-table-columns"
import { DataTable } from "../../../../../components/table/data-table"
import { ListSummary } from "../../../../../components/common/list-summary"

const PREFIX = "ac"
const PAGE_SIZE = 50

const ConditionsFooter = ({ onSave }: { onSave: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-end gap-x-2 border-t p-4">
      <SplitView.Close type="button" asChild>
        <Button variant="secondary" size="small">
          {t("actions.cancel")}
        </Button>
      </SplitView.Close>
      <Button size="small" type="button" onClick={onSave}>
        {t("actions.save")}
      </Button>
    </div>
  )
}

const CreateServiceZoneSchema = zod.object({
  name: zod.string().min(1),
  countries: zod.array(zod.string().length(2)).min(1),
})

type CreateServiceZoneFormProps = {
  fulfillmentSet: FulfillmentSetDTO
  locationId: string
}

export function CreateServiceZoneForm({
  fulfillmentSet,
  locationId,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const form = useForm<zod.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      countries: [],
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const { mutateAsync: createServiceZone, isPending: isLoading } =
    useCreateServiceZone(locationId, fulfillmentSet.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await createServiceZone({
      name: data.name,
      geo_zones: data.countries.map((iso2) => ({
        country_code: iso2,
        type: "country",
      })),
    })

    handleSuccess("/shipping")
  })

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

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
    enableRowSelection: true,
    getRowId: (row) => row.iso_2,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    prefix: PREFIX,
  })

  const onCountriesSave = () => {
    form.setValue("countries", Object.keys(rowSelection))
    setOpen(false)
  }

  const countriesWatch = form.watch("countries")

  const selectedCountries = useMemo(() => {
    return staticCountries.filter((c) => c.iso_2 in rowSelection)
  }, [countriesWatch])

  useEffect(() => {
    // set selected rows from form state on open
    if (open) {
      setRowSelection(
        countriesWatch.reduce((acc, c) => {
          acc[c] = true
          return acc
        }, {})
      )
    }
  }, [open])

  const showAreasError =
    form.formState.errors["countries"]?.type === "too_small"

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
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="m-auto flex h-full w-full  flex-col items-center divide-y overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content className="mx-auto max-w-[720px]">
              <div className="container  w-fit px-1 py-8">
                <Heading className="mb-12 mt-8 text-2xl">
                  {t("shipping.fulfillmentSet.create.title", {
                    fulfillmentSet: fulfillmentSet.name,
                  })}
                </Heading>

                <div>
                  <Text weight="plus">
                    {t("shipping.serviceZone.create.subtitle")}
                  </Text>
                  <Text className="text-ui-fg-subtle mb-8 mt-2">
                    {t("shipping.serviceZone.create.description")}
                  </Text>
                </div>

                <div className="flex max-w-[340px] flex-col gap-y-6">
                  <Form.Field
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("shipping.serviceZone.create.zoneName")}
                          </Form.Label>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>

              {/*AREAS*/}
              <div className="container flex items-center justify-between py-8">
                <div>
                  <Text weight="plus">
                    {t("shipping.serviceZone.areas.title")}
                  </Text>
                  <Text className="text-ui-fg-subtle mt-2">
                    {t("shipping.serviceZone.areas.description")}
                  </Text>
                </div>
                <Button
                  onClick={() => setOpen(true)}
                  variant="secondary"
                  type="button"
                >
                  {t("shipping.serviceZone.areas.manage")}
                </Button>
              </div>
              {!!selectedCountries.length && (
                <div className="flex items-center gap-4">
                  <div className="grow-0 rounded-lg border">
                    <div className="bg-ui-bg-field m-1 rounded-md p-2">
                      <Map className="text-ui-fg-subtle" />
                    </div>
                  </div>
                  <ListSummary
                    inline
                    list={selectedCountries.map((c) => c.display_name)}
                  />
                </div>
              )}
              {showAreasError && (
                <Alert dismissible variant="error">
                  {t("shipping.serviceZone.areas.error")}
                </Alert>
              )}
            </SplitView.Content>
            <SplitView.Drawer>
              <div className="flex size-full flex-col overflow-hidden">
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
                <ConditionsFooter onSave={onCountriesSave} />
              </div>
            </SplitView.Drawer>
          </SplitView>
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
