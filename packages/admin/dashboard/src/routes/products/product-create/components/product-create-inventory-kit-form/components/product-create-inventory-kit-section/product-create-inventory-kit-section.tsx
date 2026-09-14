import { Button, Heading, IconButton, Input, Label } from "@medusajs/ui"
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form"
import { XMarkMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

import { ProductCreateSchemaType } from "../../../../types"
import { Form } from "../../../../../../../components/common/form"
import { Combobox } from "../../../../../../../components/inputs/combobox"
import { useComboboxData } from "../../../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../../../lib/client"
import { castNumber } from "../../../../../../../lib/cast-number"

type InventoryItemRowProps = {
  form: UseFormReturn<ProductCreateSchemaType>
  variantIndex: number
  inventoryIndex: number
  inventoryItem: any
  isItemOptionDisabled: (
    option: { value: string },
    inventoryIndex: number
  ) => boolean
  onRemove: () => void
}

function InventoryItemRow({
  form,
  variantIndex,
  inventoryIndex,
  inventoryItem,
  isItemOptionDisabled,
  onRemove,
}: InventoryItemRowProps) {
  const { t } = useTranslation()

  const selectedInventoryItemId = useWatch({
    control: form.control,
    name: `variants.${variantIndex}.inventory.${inventoryIndex}.inventory_item_id`,
  })

  const items = useComboboxData({
    queryKey: ["inventory_items"],
    defaultValueKey: "id",
    selectedValue: selectedInventoryItemId,
    queryFn: (params) => sdk.admin.inventoryItem.list(params),
    getOptions: (data) =>
      data.inventory_items.map((item) => ({
        label: `${item.title} ${item.sku ? `(${item.sku})` : ""}`,
        value: item.id,
      })),
  })

  return (
    <li
      key={inventoryItem.id}
      className="bg-ui-bg-component shadow-elevation-card-rest grid grid-cols-[1fr_28px] items-center gap-1.5 rounded-xl p-1.5"
    >
      <div className="grid grid-cols-[min-content,1fr] items-center gap-1.5">
        <div className="flex items-center px-2 py-1.5">
          <Label
            size="xsmall"
            weight="plus"
            className="text-ui-fg-subtle"
            htmlFor={`variants.${variantIndex}.inventory.${inventoryIndex}.inventory_item_id`}
          >
            {t("fields.item")}
          </Label>
        </div>

        <Form.Field
          control={form.control}
          name={`variants.${variantIndex}.inventory.${inventoryIndex}.inventory_item_id`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={items.options.map((o) => ({
                      ...o,
                      disabled: isItemOptionDisabled(o, inventoryIndex),
                    }))}
                    searchValue={items.searchValue}
                    onBlur={() => items.onSearchValueChange("")}
                    onSearchValueChange={items.onSearchValueChange}
                    fetchNextPage={items.fetchNextPage}
                    className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                    placeholder={t("products.create.inventory.itemPlaceholder")}
                  />
                </Form.Control>
              </Form.Item>
            )
          }}
        />

        <div className="flex items-center px-2 py-1.5">
          <Label
            size="xsmall"
            weight="plus"
            className="text-ui-fg-subtle"
            htmlFor={`variants.${variantIndex}.inventory.${inventoryIndex}.required_quantity`}
          >
            {t("fields.quantity")}
          </Label>
        </div>
        <Form.Field
          control={form.control}
          name={`variants.${variantIndex}.inventory.${inventoryIndex}.required_quantity`}
          render={({ field: { onChange, value, ...field } }) => {
            return (
              <Form.Item>
                <Form.Control>
                  <Input
                    type="number"
                    className="bg-ui-bg-field-component"
                    min={0}
                    step="any"
                    value={value}
                    onChange={(e) => {
                      const value = e.target.value

                      if (value === "") {
                        onChange(null)
                      } else {
                        onChange(castNumber(value))
                      }
                    }}
                    {...field}
                    placeholder={t(
                      "products.create.inventory.quantityPlaceholder"
                    )}
                  />
                </Form.Control>
                <Form.ErrorMessage />
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
        onClick={onRemove}
      >
        <XMarkMini />
      </IconButton>
    </li>
  )
}

type VariantSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
  variant: ProductCreateSchemaType["variants"][0]
  index: number
}

function VariantSection({ form, variant, index }: VariantSectionProps) {
  const { t } = useTranslation()

  const inventory = useFieldArray({
    control: form.control,
    name: `variants.${index}.inventory`,
  })

  const inventoryFormData = useWatch({
    control: form.control,
    name: `variants.${index}.inventory`,
  })

  /**
   * Will mark an option as disabled if another input already selected that option
   */
  const isItemOptionDisabled = (
    option: { value: string },
    inventoryIndex: number
  ) => {
    return !!inventoryFormData?.some(
      (i, index) =>
        index != inventoryIndex && i.inventory_item_id === option.value
    )
  }

  return (
    <div className="grid gap-y-4">
      <div className="flex items-start justify-between gap-x-4">
        <div className="flex flex-col">
          <Form.Label>{variant.title}</Form.Label>
          <Form.Hint>{t("products.create.inventory.label")}</Form.Hint>
        </div>
        <Button
          size="small"
          variant="secondary"
          type="button"
          onClick={() => {
            inventory.append({
              inventory_item_id: "",
              required_quantity: "",
            })
          }}
        >
          {t("actions.add")}
        </Button>
      </div>
      {inventory.fields.map((inventoryItem, inventoryIndex) => (
        <InventoryItemRow
          key={inventoryItem.id}
          form={form}
          variantIndex={index}
          inventoryIndex={inventoryIndex}
          inventoryItem={inventoryItem}
          isItemOptionDisabled={isItemOptionDisabled}
          onRemove={() => inventory.remove(inventoryIndex)}
        />
      ))}
    </div>
  )
}

type ProductCreateInventoryKitSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateInventoryKitSection = ({
  form,
}: ProductCreateInventoryKitSectionProps) => {
  const { t } = useTranslation()

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
  })

  return (
    <div id="organize" className="flex flex-col gap-y-8">
      <Heading>{t("products.create.inventory.heading")}</Heading>

      {variants.fields
        .map((variant, variantIndex) => ({ variant, variantIndex }))
        .filter(({ variant }) => variant.inventory_kit)
        .map(({ variant, variantIndex }) => (
          <VariantSection
            key={variant.id}
            form={form}
            variant={variant}
            index={variantIndex}
          />
        ))}
    </div>
  )
}
