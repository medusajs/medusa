import {
  Button,
  Checkbox,
  DatePicker,
  Heading,
  IconButton,
  Input,
  RadioGroup,
  Select,
  Text,
  Textarea,
  clx,
} from "@medusajs/ui"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { MagnifyingGlass, XMarkMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
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
import { ChildModal } from "../../../../../components/route-modal/child-modal"
import { useChildModal } from "../../../../../components/route-modal/child-modal/hooks"
import { DataTable } from "../../../../../components/table/data-table"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import type {
  PricingCreateSchemaType,
  PricingCustomerGroupsArrayType,
} from "./schema"

type PricingDetailsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

export const PricingDetailsForm = ({ form }: PricingDetailsFormProps) => {
  const { t } = useTranslation()

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "customer_group_ids",
    keyName: "cg_id",
  })

  const { setIsOpen } = useChildModal()

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
    setIsOpen("cg", false)
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-8 py-16">
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
                    <Form.Label>{t("priceLists.fields.type.label")}</Form.Label>
                    <Form.Hint>{t("priceLists.fields.type.hint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup
                      onValueChange={onChange}
                      {...rest}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <RadioGroup.ChoiceBox
                        value={"sale"}
                        label={t("priceLists.fields.type.options.sale.label")}
                        description={t(
                          "priceLists.fields.type.options.sale.description"
                        )}
                      />
                      <RadioGroup.ChoiceBox
                        value={"override"}
                        label={t(
                          "priceLists.fields.type.options.override.label"
                        )}
                        description={t(
                          "priceLists.fields.type.options.override.description"
                        )}
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
          <div className="grid grid-cols-1  gap-4 md:grid-cols-2">
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
            <Form.Field
              control={form.control}
              name="status"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("priceLists.fields.status.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="active">
                            {t("priceLists.fields.status.active")}
                          </Select.Item>
                          <Select.Item value="draft">
                            {t("priceLists.fields.status.draft")}
                          </Select.Item>
                        </Select.Content>
                      </Select>
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
          render={({ field: { value, ...field } }) => {
            return (
              <Form.Item>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col">
                    <Form.Label optional>
                      {t("priceLists.fields.startsAt.label")}
                    </Form.Label>
                    <Form.Hint>
                      {t("priceLists.fields.startsAt.hint")}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    {/* TODO: Add timepicker see CORE-2382 */}
                    <DatePicker
                      mode="single"
                      {...field}
                      value={value ?? undefined}
                    />
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Divider />
        <Form.Field
          control={form.control}
          name="ends_at"
          render={({ field: { value, ...field } }) => {
            return (
              <Form.Item>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col">
                    <Form.Label optional>
                      {t("priceLists.fields.endsAt.label")}
                    </Form.Label>
                    <Form.Hint>{t("priceLists.fields.endsAt.hint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <DatePicker
                      mode="single"
                      {...field}
                      value={value ?? undefined}
                    />
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Divider />
        <Form.Field
          control={form.control}
          name="customer_group_ids"
          render={({ field }) => {
            return (
              <Form.Item>
                <div>
                  <Form.Label optional>
                    {t("priceLists.fields.customerAvailability.label")}
                  </Form.Label>
                  <Form.Hint>
                    {t("priceLists.fields.customerAvailability.hint")}
                  </Form.Hint>
                </div>
                <Form.Control>
                  <div
                    className={clx(
                      "bg-ui-bg-component shadow-elevation-card-rest transition-fg grid gap-1.5 rounded-xl py-1.5",
                      "aria-[invalid='true']:shadow-borders-error"
                    )}
                    role="application"
                    ref={field.ref}
                  >
                    <div className="text-ui-fg-subtle grid gap-1.5 px-1.5 md:grid-cols-2">
                      <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                        {t("priceLists.fields.customerAvailability.attribute")}
                      </div>
                      <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                        {t("operators.in")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-1.5">
                      <ChildModal id="cg">
                        <ChildModal.Trigger asChild>
                          <button
                            type="button"
                            className="bg-ui-bg-field shadow-borders-base txt-compact-small text-ui-fg-muted flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5"
                          >
                            <MagnifyingGlass />
                            {t(
                              "priceLists.fields.customerAvailability.placeholder"
                            )}
                          </button>
                        </ChildModal.Trigger>
                        <ChildModal.Trigger asChild>
                          <Button variant="secondary">
                            {t("actions.browse")}
                          </Button>
                        </ChildModal.Trigger>
                        <ChildModal.Content>
                          <ChildModal.Header />
                          <CustomerGroupDrawer
                            saveCustomerGroups={handleAddCustomerGroup}
                            selectedCustomerGroups={fields}
                          />
                        </ChildModal.Content>
                      </ChildModal>
                    </div>
                    {fields.length > 0 ? (
                      <div className="flex flex-col gap-y-1.5">
                        <Divider variant="dashed" />
                        <div className="flex flex-col gap-y-1.5 px-1.5">
                          {fields.map((field, index) => {
                            return (
                              <div
                                key={field.cg_id}
                                className="bg-ui-bg-field-component shadow-borders-base flex items-center justify-between gap-2 rounded-md px-2 py-0.5"
                              >
                                <Text size="small" leading="compact">
                                  {field.name}
                                </Text>
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <XMarkMini />
                                </IconButton>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
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
    <div className="flex size-full flex-col overflow-hidden">
      <ChildModal.Body className="min-h-0">
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
      </ChildModal.Body>
      <ChildModal.Footer>
        <ChildModal.Close asChild>
          <Button variant="secondary" size="small" type="button">
            {t("actions.cancel")}
          </Button>
        </ChildModal.Close>
        <Button type="button" size="small" onClick={handleSave}>
          {t("actions.add")}
        </Button>
      </ChildModal.Footer>
    </div>
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
