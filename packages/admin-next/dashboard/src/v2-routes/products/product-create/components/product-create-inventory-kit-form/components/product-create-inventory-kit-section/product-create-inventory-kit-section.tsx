import React from "react"
import { Button, Heading, IconButton, Input, Label } from "@medusajs/ui"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { XMarkMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

import { ProductCreateSchemaType } from "../../../../types"
import { Form } from "../../../../../../../components/common/form"

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
              title: "",
              quantity: 0,
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
                htmlFor={`variants.${index}.inventory.${inventoryIndex}.title`}
              >
                {t("fields.name")}
              </Label>
            </div>
            <Input
              className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
              {...form.register(
                `variants.${index}.inventory.${inventoryIndex}.title` as const
              )}
            />
            <div className="flex items-center px-2 py-1.5">
              <Label
                size="xsmall"
                weight="plus"
                className="text-ui-fg-subtle"
                htmlFor={`variants.${index}.inventory.${inventoryIndex}.title`}
              >
                {t("fields.quantity")}
              </Label>
            </div>
            <Form.Field
              control={form.control}
              name={`variants.${index}.inventory.${inventoryIndex}.quantity`}
              render={({ field: { onChange, value, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        type="number"
                        className="bg-ui-bg-field-component"
                        placeholder={t(
                          "inventory.reservation.quantityPlaceholder"
                        )}
                        min={0}
                        value={value}
                        onChange={(e) => {
                          const value = e.target.value

                          if (value === "") {
                            onChange(null)
                          } else {
                            onChange(parseFloat(value))
                          }
                        }}
                        {...field}
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

      {variants.fields.map((variant, variantIndex) => (
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
