import { zodResolver } from "@hookform/resolvers/zod"
import { XMarkMini } from "@medusajs/icons"
import {
  Button,
  Checkbox,
  Heading,
  Input,
  Select,
  Switch,
  Text,
  clx,
  toast,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { PaymentProviderDTO, RegionCountryDTO } from "@medusajs/types"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import { useCreateRegion } from "../../../../../hooks/api/regions"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { countries as staticCountries } from "../../../../../lib/countries"
import { CurrencyInfo } from "../../../../../lib/currencies"
import { formatProvider } from "../../../../../lib/format-provider"
import { useCountries } from "../../../common/hooks/use-countries"
import { useCountryTableColumns } from "../../../common/hooks/use-country-table-columns"
import { useCountryTableQuery } from "../../../common/hooks/use-country-table-query"
import { useUpsertPricePreference } from "../../../../../hooks/api/price-preferences"

type CreateRegionFormProps = {
  currencies: CurrencyInfo[]
  paymentProviders: PaymentProviderDTO[]
}

const CreateRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string().min(2, "Select a currency"),
  automatic_taxes: zod.boolean(),
  is_tax_inclusive: zod.boolean(),
  countries: zod.array(zod.object({ code: zod.string(), name: zod.string() })),
  payment_providers: zod.array(zod.string()).min(1),
})

const PREFIX = "cr"
const PAGE_SIZE = 50

export const CreateRegionForm = ({
  currencies,
  paymentProviders,
}: CreateRegionFormProps) => {
  const [open, setOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateRegionSchema>>({
    defaultValues: {
      name: "",
      currency_code: "",
      automatic_taxes: true,
      is_tax_inclusive: false,
      countries: [],
      payment_providers: [],
    },
    resolver: zodResolver(CreateRegionSchema),
  })

  const selectedCountries = useWatch({
    control: form.control,
    name: "countries",
    defaultValue: [],
  })

  const { t } = useTranslation()

  const { mutateAsync: createRegion, isPending: isPendingRegion } =
    useCreateRegion()
  const {
    mutateAsync: upsertPricePreferences,
    isPending: isPendingPreference,
  } = useUpsertPricePreference()

  const handleSubmit = form.handleSubmit(async (values) => {
    const regionRes = await createRegion(
      {
        name: values.name,
        countries: values.countries.map((c) => c.code),
        currency_code: values.currency_code,
        payment_providers: values.payment_providers,
        automatic_taxes: values.automatic_taxes,
      },
      {
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )

    await upsertPricePreferences(
      {
        attribute: "region_id",
        value: regionRes.region.id,
        is_tax_inclusive: values.is_tax_inclusive,
      },
      {
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )

    toast.success(t("general.success"), {
      description: t("regions.toast.create"),
      dismissLabel: t("actions.close"),
    })

    handleSuccess(`../${regionRes.region.id}`)
  })

  const { searchParams, raw } = useCountryTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { countries, count } = useCountries({
    countries: staticCountries.map((c, i) => ({
      display_name: c.display_name,
      name: c.name,
      id: i,
      iso_2: c.iso_2,
      iso_3: c.iso_3,
      num_code: c.num_code,
      region_id: null,
      region: {} as any,
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
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    getRowId: (row) => row.iso_2,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const saveCountries = () => {
    const selected = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    )

    form.setValue(
      "countries",
      selected.map((key) => ({
        code: key,
        name: staticCountries.find((c) => c.iso_2 === key)!.display_name,
      })),
      { shouldDirty: true, shouldTouch: true }
    )

    setOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open)

    if (!open) {
      const ids = selectedCountries.reduce((acc, c) => {
        acc[c.code] = true
        return acc
      }, {} as RowSelectionState)

      requestAnimationFrame(() => {
        setRowSelection(ids)
      })
    }
  }

  const removeCountry = (code: string) => {
    const update = selectedCountries.filter((c) => c.code !== code)
    const ids = update
      .map((c) => c.code)
      .reduce((acc, c) => {
        acc[c] = true
        return acc
      }, {} as RowSelectionState)

    form.setValue("countries", update, { shouldDirty: true, shouldTouch: true })
    setRowSelection(ids)
  }

  const clearCountries = () => {
    form.setValue("countries", [], { shouldDirty: true, shouldTouch: true })
    setRowSelection({})
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              type="submit"
              isLoading={isPendingRegion || isPendingPreference}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex overflow-hidden">
          <SplitView open={open} onOpenChange={onOpenChange}>
            <SplitView.Content>
              <div
                className={clx(
                  "flex h-full w-full flex-col items-center overflow-y-auto p-16"
                )}
                id="form-section"
              >
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <div>
                    <Heading>{t("regions.createRegion")}</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("regions.createRegionHint")}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-y-4">
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
                      <Form.Field
                        control={form.control}
                        name="currency_code"
                        render={({ field: { onChange, ref, ...field } }) => {
                          return (
                            <Form.Item>
                              <Form.Label>{t("fields.currency")}</Form.Label>
                              <Form.Control>
                                <Select {...field} onValueChange={onChange}>
                                  <Select.Trigger ref={ref}>
                                    <Select.Value />
                                  </Select.Trigger>
                                  <Select.Content>
                                    {currencies.map((currency) => (
                                      <Select.Item
                                        value={currency.code}
                                        key={currency.code}
                                      >
                                        {currency.name}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select>
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />
                    </div>
                  </div>
                  <Form.Field
                    control={form.control}
                    name="automatic_taxes"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <div>
                            <div className="flex items-start justify-between">
                              <Form.Label>
                                {t("fields.automaticTaxes")}
                              </Form.Label>
                              <Form.Control>
                                <Switch
                                  {...field}
                                  checked={value}
                                  onCheckedChange={onChange}
                                />
                              </Form.Control>
                            </div>
                            <Form.Hint>
                              {t("regions.automaticTaxesHint")}
                            </Form.Hint>
                            <Form.ErrorMessage />
                          </div>
                        </Form.Item>
                      )
                    }}
                  />

                  <Form.Field
                    control={form.control}
                    name="is_tax_inclusive"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <div>
                            <div className="flex items-start justify-between">
                              <Form.Label>
                                {t("fields.taxInclusivePricing")}
                              </Form.Label>
                              <Form.Control>
                                <Switch
                                  {...field}
                                  checked={value}
                                  onCheckedChange={onChange}
                                />
                              </Form.Control>
                            </div>
                            <Form.Hint>
                              {t("regions.taxInclusiveHint")}
                            </Form.Hint>
                            <Form.ErrorMessage />
                          </div>
                        </Form.Item>
                      )
                    }}
                  />

                  <div className="bg-ui-border-base h-px w-full" />
                  <div className="flex flex-col gap-y-4">
                    <div>
                      <Text size="small" leading="compact" weight="plus">
                        {t("fields.countries")}
                      </Text>
                      <Text size="small" className="text-ui-fg-subtle">
                        {t("regions.countriesHint")}
                      </Text>
                    </div>
                    {selectedCountries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCountries.map((country) => (
                          <CountryTag
                            key={country.code}
                            country={country}
                            onRemove={removeCountry}
                          />
                        ))}
                        <Button
                          variant="transparent"
                          size="small"
                          className="text-ui-fg-muted hover:text-ui-fg-subtle"
                          onClick={clearCountries}
                        >
                          {t("actions.clearAll")}
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setOpen(true)}
                        type="button"
                      >
                        {t("regions.addCountries")}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-ui-border-base h-px w-full" />
                  <div className="flex flex-col gap-y-4">
                    <div>
                      <Text size="small" leading="compact" weight="plus">
                        {t("fields.providers")}
                      </Text>
                      <Text size="small" className="text-ui-fg-subtle">
                        {t("regions.providersHint")}
                      </Text>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Form.Field
                        control={form.control}
                        name="payment_providers"
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Label>
                                {t("fields.paymentProviders")}
                              </Form.Label>
                              <Form.Control>
                                <Combobox
                                  options={paymentProviders.map((pp) => ({
                                    label: formatProvider(pp.id),
                                    value: pp.id,
                                  }))}
                                  {...field}
                                />
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer>
              <div className="flex size-full flex-col overflow-hidden">
                <DataTable
                  table={table}
                  columns={columns}
                  count={count}
                  pageSize={PAGE_SIZE}
                  orderBy={["name", "code"]}
                  pagination
                  search
                  layout="fill"
                  queryObject={raw}
                  prefix={PREFIX}
                />
                <div className="flex items-center justify-end gap-x-2 border-t p-4">
                  <SplitView.Close type="button">
                    {t("actions.cancel")}
                  </SplitView.Close>
                  <Button size="small" type="button" onClick={saveCountries}>
                    {t("actions.save")}
                  </Button>
                </div>
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
  )
}

const CountryTag = ({
  country,
  onRemove,
}: {
  country: { code: string; name: string }
  onRemove: (code: string) => void
}) => {
  return (
    <div className="bg-ui-bg-field shadow-borders-base transition-fg hover:bg-ui-bg-field-hover flex h-7 items-center overflow-hidden rounded-md">
      <div className="txt-compact-small-plus flex h-full select-none items-center justify-center px-2 py-0.5">
        {country.name}
      </div>
      <button
        type="button"
        onClick={() => onRemove(country.code)}
        className="focus-visible:bg-ui-bg-field-hover transition-fg hover:bg-ui-bg-field-hover flex h-full w-7 items-center justify-center border-l outline-none"
      >
        <XMarkMini className="text-ui-fg-muted" />
      </button>
    </div>
  )
}
