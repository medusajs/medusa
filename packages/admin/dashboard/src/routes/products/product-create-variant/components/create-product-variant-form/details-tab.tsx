import React from "react"
import { Heading, Input, Switch } from "@medusajs/ui"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { HttpTypes } from "@medusajs/types"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { CreateProductVariantSchema } from "./constants"

type DetailsTabProps = {
  product: HttpTypes.AdminProduct
  form: UseFormReturn<z.infer<typeof CreateProductVariantSchema>>
}

function DetailsTab({ form, product }: DetailsTabProps) {
  const { t } = useTranslation()

  const manageInventoryEnabled = useWatch({
    control: form.control,
    name: "manage_inventory",
  })

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-8 py-16">
        <Heading level="h1">{t("products.variant.create.header")}</Heading>

        <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
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
            name="sku"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.sku")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />

          {product.options.map((option: any) => (
            <Form.Field
              key={option.id}
              control={form.control}
              name={`options.${option.title}`}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{option.title}</Form.Label>
                    <Form.Control>
                      <Combobox
                        value={value}
                        onChange={(v) => {
                          onChange(v)
                        }}
                        {...field}
                        options={option.values.map((v: any) => ({
                          label: v.value,
                          value: v.value,
                        }))}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-y-4">
          <Form.Field
            control={form.control}
            name="manage_inventory"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                    <Form.Control>
                      <Switch
                        className="mt-[2px]"
                        checked={value}
                        onCheckedChange={(checked) => onChange(!!checked)}
                        {...field}
                      />
                    </Form.Control>

                    <div className="flex flex-col">
                      <Form.Label>
                        {t("products.variant.inventory.manageInventoryLabel")}
                      </Form.Label>
                      <Form.Hint>
                        {t("products.variant.inventory.manageInventoryHint")}
                      </Form.Hint>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="allow_backorder"
            disabled={!manageInventoryEnabled}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                    <Form.Control>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => onChange(!!checked)}
                        {...field}
                        disabled={!manageInventoryEnabled}
                      />
                    </Form.Control>
                    <div className="flex flex-col">
                      <Form.Label>
                        {t("products.variant.inventory.allowBackordersLabel")}
                      </Form.Label>
                      <Form.Hint>
                        {t("products.variant.inventory.allowBackordersHint")}
                      </Form.Hint>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="inventory_kit"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="bg-ui-bg-component shadow-elevation-card-rest flex gap-x-3 rounded-lg p-4">
                    <Form.Control>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => onChange(!!checked)}
                        {...field}
                        disabled={!manageInventoryEnabled}
                      />
                    </Form.Control>
                    <div className="flex flex-col">
                      <Form.Label>
                        {t("products.variant.inventory.inventoryKit")}
                      </Form.Label>
                      <Form.Hint>
                        {t("products.variant.inventory.inventoryKitHint")}
                      </Form.Hint>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DetailsTab
