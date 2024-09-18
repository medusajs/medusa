import React from "react"
import { z } from "zod"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { Button, Heading, IconButton, Input, Label } from "@medusajs/ui"

import { CreateProductVariantSchema } from "./constants"
import { XMarkMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"

type InventoryKitTabProps = {
  form: UseFormReturn<z.infer<typeof CreateProductVariantSchema>>
}

function InventoryKitTab({ form }: InventoryKitTabProps) {
  const { t } = useTranslation()

  const inventory = useFieldArray({
    control: form.control,
    name: `inventory`,
  })

  const inventoryFormData = inventory.fields

  const items = useComboboxData({
    queryKey: ["inventory_items"],
    queryFn: (params) => sdk.admin.inventoryItem.list(params),
    getOptions: (data) =>
      data.inventory_items.map((item) => ({
        label: item.title,
        value: item.id,
      })),
  })

  /**
   * Will mark an option as disabled if another input already selected that option
   * @param option
   * @param inventoryIndex
   */
  const isItemOptionDisabled = (
    option: (typeof items.options)[0],
    inventoryIndex: number
  ) => {
    return inventoryFormData?.some(
      (i, index) =>
        index != inventoryIndex && i.inventory_item_id === option.value
    )
  }

  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <div id="organize" className="flex flex-col gap-y-8">
          <Heading>{t("products.create.inventory.heading")}</Heading>

          <div className="grid gap-y-4">
            <div className="flex items-start justify-between gap-x-4">
              <div className="flex flex-col">
                <Form.Label>{form.getValues("title")}</Form.Label>
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
                      htmlFor={`inventory.${inventoryIndex}.inventory_item_id`}
                    >
                      {t("fields.item")}
                    </Label>
                  </div>

                  <Form.Field
                    control={form.control}
                    name={`inventory.${inventoryIndex}.inventory_item_id`}
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Combobox
                              {...field}
                              options={items.options.map((o) => ({
                                ...o,
                                disabled: isItemOptionDisabled(
                                  o,
                                  inventoryIndex
                                ),
                              }))}
                              searchValue={items.searchValue}
                              onSearchValueChange={items.onSearchValueChange}
                              fetchNextPage={items.fetchNextPage}
                              className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                              placeholder={t(
                                "products.create.inventory.itemPlaceholder"
                              )}
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
                      htmlFor={`inventory.${inventoryIndex}.required_quantity`}
                    >
                      {t("fields.quantity")}
                    </Label>
                  </div>
                  <Form.Field
                    control={form.control}
                    name={`inventory.${inventoryIndex}.required_quantity`}
                    render={({ field: { onChange, value, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Input
                              type="number"
                              className="bg-ui-bg-field-component"
                              min={0}
                              value={value}
                              onChange={(e) => {
                                const value = e.target.value

                                if (value === "") {
                                  onChange(null)
                                } else {
                                  onChange(Number(value))
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
                  onClick={() => inventory.remove(inventoryIndex)}
                >
                  <XMarkMini />
                </IconButton>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryKitTab
