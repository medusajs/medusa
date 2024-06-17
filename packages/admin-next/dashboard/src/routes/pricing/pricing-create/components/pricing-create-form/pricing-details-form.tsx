import {
  Button,
  Checkbox,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { XMarkMini } from "@medusajs/icons"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { t } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SplitView } from "../../../../../components/layout/split-view"
import { DataTable } from "../../../../../components/table/data-table"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import type {
  PricingCreateSchemaType,
  PricingCustomerGroupsArrayType,
} from "./schema"
import { HttpTypes } from "@medusajs/types"

type PricingDetailsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

export const PricingDetailsForm = ({ form }: PricingDetailsFormProps) => {
  const [open, setOpen] = useState(false)
  const [showCustomerGroups, setShowCustomerGroups] = useState(
    !!form.getValues("customer_group_ids")?.length
  )

  const { t } = useTranslation()

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "customer_group_ids",
    keyName: "cg_id",
  })

  const handleAddCustomerGroup = (groups: PricingCustomerGroupsArrayType) => {
    const newIds = groups.map((group) => group.id)

    const fieldsToAdd = groups.filter(
      (group) => !fields.some((field) => field.id === group.id)
    )

    for (const field of fields) {
      if (!newIds.includes(field.id)) {
        remove(fields.indexOf(field))
      }
    }

    append(fieldsToAdd)
    setOpen(false)
  }

  const handleOpenDrawer = () => {
    setOpen(true)
  }

  const handleShowCustomerGroups = (open: boolean) => {
    if (!open) {
      form.setValue("customer_group_ids", [])
    }

    setShowCustomerGroups(open)
  }

  return (
    <SplitView open={open} onOpenChange={setOpen}>
      <SplitView.Content>
        <div className="flex flex-1 flex-col items-center overflow-y-auto">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
            <div>
              <Heading>{t("pricing.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("pricing.create.hint")}
              </Text>
            </div>
            <Form.Field
              control={form.control}
              name="type"
              render={({ field: { onChange, ...rest } }) => {
                return (
                  <Form.Item>
                    <div className="flex flex-col gap-y-4">
                      <div>
                        <Form.Label>{t("fields.type")}</Form.Label>
                        <Form.Hint>{t("pricing.fields.typeHint")}</Form.Hint>
                      </div>
                      <Form.Control>
                        <RadioGroup
                          onValueChange={onChange}
                          {...rest}
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                          <RadioGroup.ChoiceBox
                            value={"sale"}
                            label="Sale"
                            description="Choose this if you are creating a sale"
                          />
                          <RadioGroup.ChoiceBox
                            value={"override"}
                            label="Override"
                            description="Choose this if you are creating an override"
                          />
                        </RadioGroup>
                      </Form.Control>
                    </div>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.title")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.description")}</Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
            <Divider />
            <Form.Field
              control={form.control}
              name="starts_at"
              render={({ field: { value, onChange, ...rest } }) => {
                const handleSwitchChange = (checked: boolean) => {
                  if (!checked) {
                    onChange(null)
                    return
                  }

                  const now = new Date()

                  onChange(now)
                }

                return (
                  <Form.Item>
                    <Collapsible.Root
                      open={!!value}
                      onOpenChange={handleSwitchChange}
                    >
                      <div className="grid grid-cols-[1fr_32px] gap-4">
                        <div>
                          <div className="flex items-center gap-x-1">
                            <Text size="small" leading="compact" weight="plus">
                              {t("pricing.fields.startDateLabel")}
                            </Text>
                            <Text
                              size="small"
                              leading="compact"
                              className="text-ui-fg-muted"
                            >
                              ({t("fields.optional")})
                            </Text>
                          </div>
                          <Text size="small" className="text-ui-fg-subtle">
                            {t("pricing.fields.startDateHint")}
                          </Text>
                        </div>
                        <Collapsible.Trigger asChild>
                          <Switch name={rest.name} checked={!!value} />
                        </Collapsible.Trigger>
                      </div>
                      <Collapsible.Content>
                        <div className="flex flex-col gap-y-2 pt-4">
                          <Form.Label className="!txt-small text-ui-fg-subtle">
                            {t("fields.startDate")}
                          </Form.Label>
                          <Form.Control>
                            <DatePicker
                              value={value || undefined}
                              onChange={onChange}
                              {...rest}
                            />
                          </Form.Control>
                        </div>
                      </Collapsible.Content>
                      <Form.ErrorMessage />
                    </Collapsible.Root>
                  </Form.Item>
                )
              }}
            />
            <Divider />
            <Form.Field
              control={form.control}
              name="ends_at"
              render={({ field: { value, onChange, ...rest } }) => {
                const handleSwitchChange = (checked: boolean) => {
                  if (!checked) {
                    onChange(null)
                    return
                  }

                  const inAWeek = new Date(
                    new Date().setDate(new Date().getDate() + 7)
                  )

                  onChange(inAWeek)
                }

                return (
                  <Form.Item>
                    <Collapsible.Root
                      open={!!value}
                      onOpenChange={handleSwitchChange}
                    >
                      <div className="grid grid-cols-[1fr_32px] gap-4">
                        <div>
                          <div className="flex items-center gap-x-1">
                            <Text size="small" leading="compact" weight="plus">
                              {t("pricing.fields.endDateLabel")}
                            </Text>
                            <Text
                              size="small"
                              leading="compact"
                              className="text-ui-fg-muted"
                            >
                              ({t("fields.optional")})
                            </Text>
                          </div>
                          <Text size="small" className="text-ui-fg-subtle">
                            {t("pricing.fields.endDateHint")}
                          </Text>
                        </div>
                        <Collapsible.Trigger asChild>
                          <Switch name={rest.name} checked={!!value} />
                        </Collapsible.Trigger>
                      </div>
                      <Collapsible.Content>
                        <div className="flex flex-col gap-y-2 pt-4">
                          <Form.Label className="!txt-small text-ui-fg-subtle">
                            {t("fields.endDate")}
                          </Form.Label>
                          <Form.Control>
                            <DatePicker
                              value={value || undefined}
                              onChange={onChange}
                              {...rest}
                            />
                          </Form.Control>
                        </div>
                      </Collapsible.Content>
                      <Form.ErrorMessage />
                    </Collapsible.Root>
                  </Form.Item>
                )
              }}
            />
            <Divider />
            <div>
              <Collapsible.Root
                open={showCustomerGroups}
                onOpenChange={handleShowCustomerGroups}
              >
                <Form.Field
                  control={form.control}
                  name="customer_group_ids"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <div className="grid grid-cols-[1fr_32px] items-start gap-4">
                          <div>
                            <Form.Label optional>
                              {t("pricing.fields.customerAvailabilityLabel")}
                            </Form.Label>
                            <Form.Hint>
                              {t("pricing.fields.customerAvailabilityHint")}
                            </Form.Hint>
                          </div>
                          <Form.Control>
                            <Collapsible.Trigger asChild>
                              <Switch
                                name={field.name}
                                checked={showCustomerGroups}
                              />
                            </Collapsible.Trigger>
                          </Form.Control>
                        </div>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Collapsible.Content>
                  <div className="flex flex-col pt-4">
                    {fields.length > 0 ? (
                      fields.map((field, index) => {
                        return (
                          <div
                            key={field.cg_id}
                            className="bg-ui-bg-field shadow-borders-base transition-fg hover:bg-ui-bg-field-hover flex h-7 w-fit items-center overflow-hidden rounded-md"
                          >
                            <div className="txt-compact-small-plus flex h-full select-none items-center justify-center px-2 py-0.5">
                              {field.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="focus-visible:bg-ui-bg-field-hover transition-fg hover:bg-ui-bg-field-hover flex h-full w-7 items-center justify-center border-l outline-none"
                            >
                              <XMarkMini className="text-ui-fg-muted" />
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center px-2 py-3">
                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-muted"
                        >
                          {t(
                            "pricing.fields.customerAvailabilityNoSelectionLabel"
                          )}
                        </Text>
                      </div>
                    )}
                    <div className="flex items-center justify-end">
                      <Button
                        size="small"
                        variant="secondary"
                        type="button"
                        onClick={handleOpenDrawer}
                      >
                        {t("pricing.actions.addCustomerGroups")}
                      </Button>
                    </div>
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          </div>
        </div>
      </SplitView.Content>
      <CustomerGroupDrawer
        selectedCustomerGroups={fields}
        saveCustomerGroups={handleAddCustomerGroup}
      />
    </SplitView>
  )
}

const PAGE_SIZE = 50
const PREFIX = "cg"

const initRowSelection = (
  selectedCustomerGroups: PricingCustomerGroupsArrayType
) => {
  return selectedCustomerGroups.reduce((acc, group) => {
    acc[group.id] = true
    return acc
  }, {} as RowSelectionState)
}

const CustomerGroupDrawer = ({
  selectedCustomerGroups,
  saveCustomerGroups,
}: {
  selectedCustomerGroups: PricingCustomerGroupsArrayType
  saveCustomerGroups: (arr: PricingCustomerGroupsArrayType) => void
}) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initRowSelection(selectedCustomerGroups)
  )
  const [intermediate, setIntermediate] =
    useState<PricingCustomerGroupsArrayType>(selectedCustomerGroups)

  useEffect(() => {
    // If the selected customer groups change outside of the drawer,
    // update the row selection state and intermediate state
    setRowSelection(initRowSelection(selectedCustomerGroups))
    setIntermediate(selectedCustomerGroups)
  }, [selectedCustomerGroups])

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(searchParams, {
      placeholderData: keepPreviousData,
    })

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newCustomerGroups =
      customer_groups
        ?.filter((cg) => newIds.includes(cg.id))
        .map((cg) => ({ id: cg.id, name: cg.name! })) || []

    const filteredIntermediate = intermediate.filter(
      (cg) => !removedIds.includes(cg.id)
    )

    setIntermediate([...filteredIntermediate, ...newCustomerGroups])
    setRowSelection(state)
  }

  const handleSave = () => {
    saveCustomerGroups(intermediate)
  }

  const columns = useColumns()

  const { table } = useDataTable({
    data: customer_groups || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <SplitView.Drawer>
      <div className="flex size-full flex-col overflow-hidden">
        <DataTable
          table={table}
          columns={columns}
          pageSize={PAGE_SIZE}
          count={count}
          isLoading={isLoading}
          layout="fill"
          pagination
          search
          prefix={PREFIX}
          queryObject={raw}
        />
        <div className="flex items-center justify-end gap-x-2 border-t p-4">
          <SplitView.Close type="button" asChild>
            <Button variant="secondary" size="small">
              {t("actions.cancel")}
            </Button>
          </SplitView.Close>
          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={handleSave}
          >
            {t("actions.add")}
          </Button>
        </div>
      </div>
    </SplitView.Drawer>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useColumns = () => {
  const base = useCustomerGroupTableColumns()

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
    ],
    [base]
  )
}
