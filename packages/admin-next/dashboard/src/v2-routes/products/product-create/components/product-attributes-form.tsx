import {
  Button,
  Checkbox,
  Heading,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

import { SalesChannel } from "@medusajs/medusa"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { Fragment, useMemo, useState } from "react"
import { CountrySelect } from "../../../../components/common/country-select"
import { Form } from "../../../../components/common/form"
import { HandleInput } from "../../../../components/common/handle-input"
import { DataTable } from "../../../../components/table/data-table"
import { useSalesChannelTableColumns } from "../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"
import { Combobox } from "../../../../components/common/combobox"
import { FileUpload } from "../../../../components/common/file-upload"
import { List } from "../../../../components/common/list"
import { useProductTypes } from "../../../../hooks/api/product-types"
import { useCollections } from "../../../../hooks/api/collections"
import { useSalesChannels } from "../../../../hooks/api/sales-channels"
import { useCategories } from "../../../../hooks/api/categories"
import { useTags } from "../../../../hooks/api/tags"
import { Keypair } from "../../../../components/common/keypair"
import { UseFormReturn } from "react-hook-form"
import { CreateProductSchemaType } from "../schema"

type ProductAttributesProps = {
  form: UseFormReturn<CreateProductSchemaType>
}

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

const permutations = (
  data: { title: string; values: string[] }[]
): { [key: string]: string }[] => {
  if (data.length === 0) {
    return []
  }

  if (data.length === 1) {
    return data[0].values.map((value) => ({ [data[0].title]: value }))
  }

  const toProcess = data[0]
  const rest = data.slice(1)

  return toProcess.values.flatMap((value) => {
    return permutations(rest).map((permutation) => {
      return {
        [toProcess.title]: value,
        ...permutation,
      }
    })
  })
}

const generateNameFromPermutation = (permutation: {
  [key: string]: string
}) => {
  return Object.values(permutation).join(" / ")
}

export const ProductAttributesForm = ({ form }: ProductAttributesProps) => {
  const { t } = useTranslation()
  const [open, onOpenChange] = useState(false)
  const { product_types, isLoading: isLoadingTypes } = useProductTypes()
  const { product_tags, isLoading: isLoadingTags } = useTags()
  const { collections, isLoading: isLoadingCollections } = useCollections()
  const { sales_channels, isLoading: isLoadingSalesChannels } =
    useSalesChannels()
  const { product_categories, isLoading: isLoadingCategories } = useCategories()

  const options = form.watch("options")
  const optionPermutations = permutations(options ?? [])

  // const { append } = useFieldArray({
  //   name: "images",
  //   control: form.control,
  //   // keyName: "field_id",
  // })

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
                            <Form.Label>
                              {t("products.fields.title.label")}
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
                              {t("products.fields.subtitle.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                  <Form.Hint>
                    <Trans
                      i18nKey="products.fields.title.hint"
                      t={t}
                      components={[<br key="break" />]}
                    />
                  </Form.Hint>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="handle"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label
                            tooltip={t("products.fields.handle.tooltip")}
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
                </div>
                <Form.Field
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t("products.fields.description.label")}
                        </Form.Label>
                        <Form.Control>
                          <Textarea {...field} />
                        </Form.Control>
                        <Form.Hint>
                          <Trans
                            i18nKey={"products.fields.description.hint"}
                            components={[<br key="break" />]}
                          />
                        </Form.Hint>
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <div id="organize" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.organization")}</Heading>
                <div className="grid grid-cols-1 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="discountable"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <div className="flex items-center justify-between">
                            <Form.Label optional>
                              {t("products.fields.discountable.label")}
                            </Form.Label>
                            <Form.Control>
                              <Switch
                                {...field}
                                checked={!!value}
                                onCheckedChange={onChange}
                              />
                            </Form.Control>
                          </div>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Hint>
                    <Trans i18nKey={"products.fields.discountable.hint"} />
                  </Form.Hint>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="type_id"
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.type.label")}
                          </Form.Label>
                          <Form.Control>
                            <Select
                              disabled={isLoadingTypes}
                              {...field}
                              onValueChange={onChange}
                            >
                              <Select.Trigger ref={field.ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {(product_types ?? []).map((type) => (
                                  <Select.Item key={type.id} value={type.id}>
                                    {type.value}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="collection_id"
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.collection.label")}
                          </Form.Label>
                          <Form.Control>
                            <Select
                              disabled={isLoadingCollections}
                              {...field}
                              onValueChange={onChange}
                            >
                              <Select.Trigger ref={field.ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {(collections ?? []).map((collection) => (
                                  <Select.Item
                                    key={collection.id}
                                    value={collection.id}
                                  >
                                    {collection.title}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="category_ids"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.categories.label")}
                          </Form.Label>
                          <Form.Control>
                            <Combobox
                              disabled={isLoadingCategories}
                              options={(product_categories ?? []).map(
                                (category) => ({
                                  label: category.name,
                                  value: category.id,
                                })
                              )}
                              {...field}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.tags.label")}
                          </Form.Label>
                          <Form.Control>
                            <Combobox
                              disabled={isLoadingTags}
                              options={(product_tags ?? []).map((tag) => ({
                                label: tag.value,
                                value: tag.id,
                              }))}
                              {...field}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                {/* TODO: Align to match designs */}
                <div className="grid grid-cols-1 gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="sales_channels"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.sales_channels.label")}
                          </Form.Label>
                          <Form.Hint>
                            <Trans
                              i18nKey={"products.fields.sales_channels.hint"}
                            />
                          </Form.Hint>
                          <Form.Control>
                            <Combobox
                              disabled={isLoadingSalesChannels}
                              options={(sales_channels ?? []).map(
                                (salesChannel) => ({
                                  label: salesChannel.name,
                                  value: salesChannel.id,
                                })
                              )}
                              {...field}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                {/* <Button
                  size="small"
                  variant="secondary"
                  onClick={() => onOpenChange(!open)}
                >
                  {t("actions.edit")}
                </Button> */}
              </div>
              <div id="variants" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.variants")}</Heading>
                <div className="grid grid-cols-1 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="options"
                    render={({ field: { onChange, value } }) => {
                      const normalizedValue = (value ?? []).map((v) => {
                        return {
                          key: v.title,
                          value: v.values.join(","),
                        }
                      })

                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.options.label")}
                          </Form.Label>
                          <Form.Hint>
                            {t("products.fields.options.hint")}
                          </Form.Hint>
                          <Form.Control>
                            <Keypair
                              labels={{
                                add: t("products.fields.options.add"),
                                key: t("products.fields.options.optionTitle"),
                                value: t("products.fields.options.variations"),
                              }}
                              value={normalizedValue}
                              onChange={(newVal) =>
                                onChange(
                                  newVal.map((v) => {
                                    return {
                                      title: v.key,
                                      values: v.value
                                        .split(",")
                                        .map((v) => v.trim()),
                                    }
                                  })
                                )
                              }
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="variants"
                    render={({ field: { value, onChange, ...field } }) => {
                      const selectedOptions = (value ?? []).map(
                        (v) => v.options
                      )
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.variants.label")}
                          </Form.Label>
                          <Form.Hint>
                            {t("products.fields.variants.hint")}
                          </Form.Hint>
                          <Form.Control>
                            <List
                              {...field}
                              value={selectedOptions}
                              onChange={(v) => {
                                onChange(
                                  v.map((options, i) => {
                                    return {
                                      title:
                                        generateNameFromPermutation(options),
                                      variant_rank: i,
                                      options,
                                    }
                                  })
                                )
                              }}
                              compare={(a, b) => {
                                return (
                                  generateNameFromPermutation(a) ===
                                  generateNameFromPermutation(b)
                                )
                              }}
                              options={optionPermutations.map((opt) => {
                                return {
                                  title: generateNameFromPermutation(opt),
                                  value: opt,
                                }
                              })}
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>

              <div id="attributes" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.attributes")}</Heading>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="origin_country"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.countryOrigin.label")}
                          </Form.Label>
                          <Form.Control>
                            <CountrySelect {...field} />
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
                            {t("products.fields.material.label")}
                          </Form.Label>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="width"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.width.label")}
                          </Form.Label>
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
                          <Form.Label optional>
                            {t("products.fields.length.label")}
                          </Form.Label>
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
                          <Form.Label optional>
                            {t("products.fields.height.label")}
                          </Form.Label>
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
                          <Form.Label optional>
                            {t("products.fields.weight.label")}
                          </Form.Label>
                          <Form.Control>
                            <Input {...field} type="number" min={0} />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="mid_code"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.mid_code.label")}
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
                    name="hs_code"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("products.fields.hs_code.label")}
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
              <div id="media" className="flex flex-col gap-y-8">
                <Heading level="h2">{t("products.media.label")}</Heading>
                <div className="grid grid-cols-1 gap-x-4 gap-y-8">
                  <Form.Field
                    control={form.control}
                    name="images"
                    render={() => {
                      return (
                        <Form.Item>
                          <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-1">
                              <Form.Label optional>
                                {t("products.media.label")}
                              </Form.Label>
                              <Form.Hint>
                                {t("products.media.editHint")}
                              </Form.Hint>
                            </div>
                            <Form.Control>
                              <FileUpload
                                label={t("products.media.uploadImagesLabel")}
                                hint={t("products.media.uploadImagesHint")}
                                hasError={!!form.formState.errors.images}
                                formats={SUPPORTED_FORMATS}
                                onUploaded={() => {
                                  form.clearErrors("images")
                                  // if (hasInvalidFiles(files)) {
                                  //   return
                                  // }

                                  // files.forEach((f) => append(f))
                                }}
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </div>
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
            <AddSalesChannelsDrawer onCancel={() => onOpenChange(false)} />
          </Panel>
        </Fragment>
      )}
    </PanelGroup>
  )
}

const PAGE_SIZE = 20

const AddSalesChannelsDrawer = ({ onCancel }: { onCancel: () => void }) => {
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
        <Button
          size="small"
          variant="secondary"
          onClick={onCancel}
          type="button"
        >
          {t("actions.cancel")}
        </Button>
        <Button size="small" onClick={() => {}} type="button">
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
