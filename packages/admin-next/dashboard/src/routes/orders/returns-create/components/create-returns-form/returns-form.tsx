import React from "react"
import { UseFormReturn } from "react-hook-form"
import { LineItem } from "@medusajs/medusa"
import { Heading, Select, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ReturnItem } from "./return-item.tsx"
import { Form } from "../../../../../components/common/form"

type ReturnsFormProps = {
  form: UseFormReturn<any>
  items: LineItem[]
}

export function ReturnsForm({ form, items }: ReturnsFormProps) {
  const { t } = useTranslation()

  const onQuantityChangeComplete = () => {}

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
        <div className="flex flex-col gap-y-1 pb-10">
          <Heading className="text-2xl">{t("fields.details")}</Heading>
        </div>
        <Heading className="mb-2">{t("orders.refunds.chooseItems")}</Heading>
        {items.map((item) => (
          <ReturnItem
            item={item}
            form={form}
            onQuantityChangeComplete={onQuantityChangeComplete}
            currencyCode="EUR"
          />
        ))}

        <div className="flex flex-col gap-y-1 pb-4 pt-10">
          <Heading className="text-2xl">{t("fields.shipping")}</Heading>
        </div>

        <div className="flex gap-x-4">
          <div className="flex-1">
            <Heading level="h3">{t("fields.location")}</Heading>
            <Text className="text-ui-fg-subtle mb-1">
              {t("order.refunds.locationDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="location"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {[].map((i) => (
                            <Select.Item key={i.id} value={i.name}>
                              {i.name.toUpperCase()}
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
          <div className="flex-1">
            <Heading level="h3">{t("fields.shipping")}</Heading>
            <Text className="text-ui-fg-subtle mb-1">
              {t("order.refunds.shippingDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="shipping"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {[].map((i) => (
                            <Select.Item key={i.id} value={i.name}>
                              {i.name.toUpperCase()}
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
      </div>
    </div>
  )
}
