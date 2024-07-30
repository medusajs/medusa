import React, { useState } from "react"
import { Heart } from "@medusajs/icons"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AdminOrderLineItem } from "@medusajs/types"
import { Button, IconButton, Input, Popover, toast } from "@medusajs/ui"

import { ReceiveReturnSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import {
  useAddDismissItems,
  useRemoveDismissItem,
  useUpdateDismissItem,
} from "../../../../../hooks/api/returns"

type WriteOffQuantityProps = {
  returnId: string
  orderId: string
  index: number
  item: AdminOrderLineItem
  form: UseFormReturn<typeof ReceiveReturnSchema>
}

function WrittenOffQuantity({
  form,
  item,
  index,
  returnId,
  orderId,
}: WriteOffQuantityProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: addDismissedItems } = useAddDismissItems(
    returnId,
    orderId
  )

  const { mutateAsync: updateDismissedItems } = useUpdateDismissItem(
    returnId,
    orderId
  )

  const { mutateAsync: removeDismissedItems } = useRemoveDismissItem(
    returnId,
    orderId
  )

  const onDismissedQuantityChanged = async (value: number | null) => {
    // TODO: if out of bounds prevent sending and notify user

    if (value) {
      try {
        // TODO: look into actions to see if the item is already added
        await addDismissedItems({
          items: [{ id: item.id, quantity: value }],
        })
      } catch (e) {
        toast.error(e.message)
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button className="flex gap-2 px-2" variant="secondary" type="button">
          <div>
            <Heart />
          </div>
          {!!item.detail.written_off_quantity && (
            <span>item.detail.written_off_quantity</span>
          )}
        </Button>
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
                      }}
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        onDismissedQuantityChanged(value)
                      }}
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
