import { AdminSalesChannelResponse } from "@medusajs/types"
import {
  Alert,
  Button,
  Checkbox,
  Heading,
  Hint,
  IconButton,
  Input,
  Label,
  Select,
  Switch,
  Text,
  Textarea,
  clx,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import {
  FieldArrayWithId,
  UseFormReturn,
  useFieldArray,
  useWatch,
} from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"

import { PlusMini, XMarkMini } from "@medusajs/icons"
import { Combobox } from "../../../../../components/common/combobox"
import { CountrySelect } from "../../../../../components/common/country-select"
import { FileUpload } from "../../../../../components/common/file-upload"
import { Form } from "../../../../../components/common/form"
import { HandleInput } from "../../../../../components/common/handle-input"
import { SortableList } from "../../../../../components/common/sortable-list"
import { ChipInput } from "../../../../../components/inputs/chip-input"
import { SplitView } from "../../../../../components/layout/split-view"
import { DataTable } from "../../../../../components/table/data-table"
import { useCategories } from "../../../../../hooks/api/categories"
import { useCollections } from "../../../../../hooks/api/collections"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useSalesChannels } from "../../../../../hooks/api/sales-channels"
import { useTags } from "../../../../../hooks/api/tags"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableFilters } from "../../../../../hooks/table/filters/use-sales-channel-table-filters"
import { useSalesChannelTableQuery } from "../../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { CreateProductSchemaType } from "../../schema"

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

const getPermutations = (
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
    return getPermutations(rest).map((permutation) => {
      return {
        [toProcess.title]: value,
        ...permutation,
      }
    })
  })
}

const getVariantName = (options: Record<string, string>) => {
  return Object.values(options).join(" / ")
}

export const ProductCreateDetailsForm = ({ form }: ProductAttributesProps) => {
  const [open, setOpen] = useState(false)

  const { t } = useTranslation()

  const { product_types, isLoading: isLoadingTypes } = useProductTypes()
  const { tags, isLoading: isLoadingTags } = useTags()
  const { collections, isLoading: isLoadingCollections } = useCollections()
  const { sales_channels, isLoading: isLoadingSalesChannels } =
    useSalesChannels()
  const { product_categories, isLoading: isLoadingCategories } = useCategories()

  const options = useFieldArray({
    control: form.control,
    name: "options",
  })

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const watchedOptions = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  const watchedVariants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  })

  const handleOptionValueUpdate = (index: number, value: string[]) => {
    const newOptions = [...watchedOptions]
    newOptions[index].values = value

    const permutations = getPermutations(newOptions)
    const oldVariants = [...watchedVariants]

    const findMatchingPermutation = (options: Record<string, string>) => {
      return permutations.find((permutation) =>
        Object.keys(options).every((key) => options[key] === permutation[key])
      )
    }

    const newVariants = oldVariants.reduce((variants, variant) => {
      const match = findMatchingPermutation(variant.options)

      if (match) {
        variants.push({
          ...variant,
          title: getVariantName(match),
          options: match,
        })
      }

      return variants
    }, [] as typeof oldVariants)

    const usedPermutations = new Set(
      newVariants.map((variant) => variant.options)
    )
    const unusedPermutations = permutations.filter(
      (permutation) => !usedPermutations.has(permutation)
    )

    unusedPermutations.forEach((permutation) => {
      newVariants.push({
        title: getVariantName(permutation),
        options: permutation,
        should_create: false,
        variant_rank: newVariants.length,
      })
    })

    form.setValue("variants", newVariants)
  }

  const handleRemoveOption = (index: number) => {
    options.remove(index)

    const newOptions = [...watchedOptions]
    newOptions.splice(index, 1)

    const permutations = getPermutations(newOptions)
    const oldVariants = [...watchedVariants]

    const findMatchingPermutation = (options: Record<string, string>) => {
      return permutations.find((permutation) =>
        Object.keys(options).every((key) => options[key] === permutation[key])
      )
    }

    const newVariants = oldVariants.reduce((variants, variant) => {
      const match = findMatchingPermutation(variant.options)

      if (match) {
        variants.push({
          ...variant,
          title: getVariantName(match),
          options: match,
        })
      }

      return variants
    }, [] as typeof oldVariants)

    const usedPermutations = new Set(
      newVariants.map((variant) => variant.options)
    )
    const unusedPermutations = permutations.filter(
      (permutation) => !usedPermutations.has(permutation)
    )

    unusedPermutations.forEach((permutation) => {
      newVariants.push({
        title: getVariantName(permutation),
        options: permutation,
        should_create: false,
        variant_rank: newVariants.length,
      })
    })

    form.setValue("variants", newVariants)
  }

  const handleRankChange = (
    items: FieldArrayWithId<CreateProductSchemaType, "variants">[]
  ) => {
    // Items in the SortableList are momorized, so we need to find the current
    // value to preserve any changes that have been made to `should_create`.
    const update = items.map((item, index) => {
      const variant = watchedVariants.find((v) => v.title === item.title)

      return {
        id: item.id,
        ...(variant || item),
        variant_rank: index,
      }
    })

    variants.replace(update)
  }

  return (
    <SplitView open={open} onOpenChange={setOpen}>
      <div className="flex h-full justify-center overflow-hidden">
        <SplitView.Content className="flex h-full w-full flex-col items-center">
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
                      render={({ field: { onChange, ref, ...field } }) => {
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
                                <Select.Trigger ref={ref}>
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
                      render={({ field: { onChange, ref, ...field } }) => {
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
                                <Select.Trigger ref={ref}>
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
                                options={(tags ?? []).map((tag) => ({
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
                    <Button
                      size="small"
                      variant="secondary"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div id="variants" className="flex flex-col gap-y-8">
                  <Heading level="h2">{t("products.variants")}</Heading>
                  <div className="flex flex-col gap-y-6">
                    <ul className="flex flex-col gap-y-4">
                      {options.fields.map((option, index) => {
                        return (
                          <li
                            key={option.id}
                            className="bg-ui-bg-component shadow-elevation-card-rest grid grid-cols-[1fr_28px] items-center gap-3 rounded-xl px-1.5 py-2"
                          >
                            <div className="flex flex-col space-y-2">
                              <Form.Field
                                control={form.control}
                                name={`options.${index}.title` as const}
                                render={({ field }) => {
                                  return (
                                    <Form.Item className="flex flex-col space-y-1.5">
                                      <div className="flex items-center pl-2">
                                        <Form.Label className="txt-compact-xsmall-plus text-ui-fg-muted">
                                          {t("fields.title")}
                                        </Form.Label>
                                      </div>
                                      <Form.Control>
                                        <Input
                                          {...field}
                                          className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                                        />
                                      </Form.Control>
                                    </Form.Item>
                                  )
                                }}
                              />
                              <Form.Field
                                control={form.control}
                                name={`options.${index}.values` as const}
                                render={({ field: { onChange, ...field } }) => {
                                  const handleValueChange = (
                                    value: string[]
                                  ) => {
                                    handleOptionValueUpdate(index, value)
                                    onChange(value)
                                  }

                                  return (
                                    <Form.Item className="flex flex-col space-y-1.5">
                                      <div className="flex items-center pl-2">
                                        <Form.Label className="txt-compact-xsmall-plus text-ui-fg-muted">
                                          Values
                                        </Form.Label>
                                      </div>
                                      <Form.Control>
                                        <ChipInput
                                          {...field}
                                          onChange={handleValueChange}
                                        />
                                      </Form.Control>
                                    </Form.Item>
                                  )
                                }}
                              />
                            </div>
                            <IconButton
                              type="button"
                              size="small"
                              variant="transparent"
                              className="text-ui-fg-muted"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <XMarkMini />
                            </IconButton>
                          </li>
                        )
                      })}
                    </ul>
                    <Button
                      size="small"
                      variant="secondary"
                      type="button"
                      className="w-full"
                      onClick={() => {
                        options.append({
                          title: "",
                          values: [],
                        })
                      }}
                    >
                      <PlusMini />
                      <span>Add option</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="flex flex-col gap-y-1">
                      <Label weight="plus">
                        {t("products.fields.variants.label")}
                      </Label>
                      <Hint>{t("products.fields.variants.hint")}</Hint>
                    </div>
                    {variants.fields.length > 0 ? (
                      <div className="overflow-hidden rounded-xl border">
                        <SortableList
                          items={variants.fields}
                          onChange={handleRankChange}
                          renderItem={(item, index, overlay) => {
                            return (
                              <SortableList.Item
                                id={item.id}
                                isOverlay={overlay}
                                className={clx({
                                  "border-b-0":
                                    index === variants.fields.length - 1,
                                })}
                              >
                                <div className="flex w-full items-center gap-x-3">
                                  <Form.Field
                                    control={form.control}
                                    name={
                                      `variants.${index}.should_create` as const
                                    }
                                    render={({
                                      field: { value, onChange, ...field },
                                    }) => {
                                      return (
                                        <Form.Item>
                                          <Form.Control>
                                            <Checkbox
                                              {...field}
                                              checked={value}
                                              onCheckedChange={onChange}
                                            />
                                          </Form.Control>
                                        </Form.Item>
                                      )
                                    }}
                                  />
                                  <SortableList.DragHandle />
                                  <span>{item.title}</span>
                                </div>
                              </SortableList.Item>
                            )
                          }}
                        />
                      </div>
                    ) : (
                      <Alert>Add options to generate variants.</Alert>
                    )}
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
        </SplitView.Content>
      </div>
      <SplitView.Drawer>
        <AddSalesChannelsDrawer />
      </SplitView.Drawer>
    </SplitView>
  )
}

const PAGE_SIZE = 20
const PREFIX = "sc"

const AddSalesChannelsDrawer = () => {
  const { t } = useTranslation()
  const [selection, setSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { sales_channels, count, isLoading, isError, error } = useSalesChannels(
    {
      ...searchParams,
    }
  )

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
    prefix: PREFIX,
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
          prefix={PREFIX}
        />
      </div>
      <div className="flex items-center justify-end gap-x-2 border-t px-6 py-4">
        <SplitView.Close asChild>
          <Button size="small" variant="secondary" type="button">
            {t("actions.cancel")}
          </Button>
        </SplitView.Close>
        <Button size="small" onClick={() => {}} type="button">
          {t("actions.save")}
        </Button>
      </div>
    </div>
  )
}

const columnHelper =
  createColumnHelper<AdminSalesChannelResponse["sales_channel"]>()

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
