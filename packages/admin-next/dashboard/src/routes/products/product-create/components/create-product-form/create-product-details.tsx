import { Button, Checkbox, Heading, Input, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

import { SalesChannel } from "@medusajs/medusa"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useAdminSalesChannels } from "medusa-react"
import { Fragment, useMemo, useState } from "react"
import { CountrySelect } from "../../../../../components/common/country-select"
import { Form } from "../../../../../components/common/form"
import { HandleInput } from "../../../../../components/common/handle-input"
import { DataTable } from "../../../../../components/table/data-table"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { CreateProductFormReturn } from "./create-product-form"

type CreateProductPropsProps = {
  form: CreateProductFormReturn
}

export const CreateProductDetails = ({ form }: CreateProductPropsProps) => {
  const { t } = useTranslation()
  const [open, onOpenChange] = useState(false)

  return (
    <PanelGroup
      direction="horizontal"
      className="flex h-full justify-center overflow-hidden"
    >
      <Panel
        className="flex h-full w-full flex-col items-center"
        minSize={open ? 50 : 100}
      >
        <div className="flex size-full flex-col items-center overflow-auto p-16">
          <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
            <div className="flex flex-col gap-y-1">
              <Heading>{t("products.createProductTitle")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("products.createProductHint")}
              </Text>
            </div>
            <div className="flex flex-col gap-y-8 divide-y [&>div]:pt-8">
              <div id="general" className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-2">
                  <div className="grid grid-cols-2 gap-x-4">
                    <Form.Field
                      control={form.control}
                      name="title"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("fields.title")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                    <Form.Field
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("fields.subtitle")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    <Trans
                      i18nKey="products.titleHint"
                      t={t}
                      components={[<br key="break" />]}
                    />
                  </Text>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="handle"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label
                            tooltip={t("products.handleTooltip")}
                            optional
                          >
                            {t("fields.handle")}
                          </Form.Label>
                          <Form.Control>
                            <HandleInput {...field} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="material"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("fields.material")}
                          </Form.Label>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
              <div id="organize" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.organization")}</Heading>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => onOpenChange(!open)}
                >
                  {t("actions.edit")}
                </Button>
              </div>
              <div id="attributes" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.attributes")}</Heading>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="width"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.width")}</Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" min={0} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="length"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.length")}</Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" min={0} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="height"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.height")}</Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" min={0} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="weight"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.weight")}</Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" min={0} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="origin_country"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("fields.countryOfOrigin")}
                          </Form.Label>
                          <Form.Control>
                            <CountrySelect {...field} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {open && (
        <Fragment>
          <PanelResizeHandle className="bg-ui-bg-subtle group flex items-center justify-center border-x px-[4.5px] outline-none">
            {/* Is this meant to be resizable? And if so we need some kind of focus state for the handle cc: @ludvig18 */}
            <div className="bg-ui-fg-disabled group-focus-visible:bg-ui-fg-muted transition-fg h-6 w-[3px] rounded-full" />
          </PanelResizeHandle>
          <Panel defaultSize={50} maxSize={50} minSize={40}>
            <AddSalesChannelsDrawer />
          </Panel>
        </Fragment>
      )}
    </PanelGroup>
  )
}

const PAGE_SIZE = 20

const AddSalesChannelsDrawer = () => {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { sales_channels, count, isLoading, isError, error } =
    useAdminSalesChannels({
      ...searchParams,
    })

  const filters = useSalesChannelTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: sales_channels ?? [],
    columns,
    count: sales_channels?.length ?? 0,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    rowSelection: {
      state: selection,
      updater: setSelection,
    },
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1">
        <DataTable
          table={table}
          columns={columns}
          pageSize={PAGE_SIZE}
          filters={filters}
          isLoading={isLoading}
          layout="fill"
          orderBy={["name", "created_at", "updated_at"]}
          queryObject={raw}
          search
          pagination
          count={count}
        />
      </div>
      <div className="flex items-center justify-end gap-x-2 border-t px-6 py-4">
        <Button size="small" variant="secondary">
          {t("actions.cancel")}
        </Button>
        <Button size="small" onClick={() => {}}>
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}

const columnHelper = createColumnHelper<SalesChannel>()

const useColumns = () => {
  const base = useSalesChannelTableColumns()

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
