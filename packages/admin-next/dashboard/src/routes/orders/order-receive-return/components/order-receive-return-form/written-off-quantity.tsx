import React, { useState } from "react"
import { Heart } from "@medusajs/icons"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AdminOrderLineItem } from "@medusajs/types"
import { IconButton, Input, Popover } from "@medusajs/ui"

import { ReceiveReturnSchema } from "./constants"
import { Form } from "../../../../../components/common/form"

type WriteOffQuantityProps = {
  index: number
  item: AdminOrderLineItem
  form: UseFormReturn<typeof ReceiveReturnSchema>
}

function WrittenOffQuantity({ form, item, index }: WriteOffQuantityProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <IconButton type="button">
          <Heart />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content align="center">
        <div className="flex flex-col p-2">
          <span className="txt-small text-ui-fg-subtle mb-2 font-medium">
            {t("orders.returns.receive.writeOffInputLabel")}
          </span>
          <Form.Field
            control={form.control}
            name={`items.${index}.written_off_quantity`}
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item className="w-full">
                  <Form.Control>
                    <Input
                      min={0}
                      max={item.quantity}
                      type="number"
                      value={value}
                      className="bg-ui-bg-field-component text-right"
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value)

                        onChange(value)

                        // handleQuantityChange(item.id, value)
                      }}
                      {...field}
                    />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
        </div>
      </Popover.Content>
    </Popover>
  )
}

export default WrittenOffQuantity
