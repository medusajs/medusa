import React, { useState } from "react"
import { HeartBroken } from "@medusajs/icons"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { AdminOrderLineItem } from "@medusajs/types"
import { Button, Input, Popover, toast } from "@medusajs/ui"

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

    const action = item.actions?.find(
      (a) => a.action === "RECEIVE_DAMAGED_RETURN_ITEM"
    )

    if (typeof value === "number" && value < 0) {
      form.setValue(
        `items.${index}.written_off_quantity`,
        item.detail.written_off_quantity,
        { shouldTouch: true, shouldDirty: true }
      )

      toast.error(t("orders.returns.receive.toast.errorNegativeValue"))

      return
    }

    if (
      typeof value === "number" &&
      value > item.quantity - item.detail.return_received_quantity
    ) {
      form.setValue(
        `items.${index}.written_off_quantity`,
        item.detail.written_off_quantity,
        { shouldTouch: true, shouldDirty: true }
      )

      toast.error(t("orders.returns.receive.toast.errorLargeDamagedValue"))

      return
    }

    try {
      if (value) {
        if (!action) {
          await addDismissedItems({
            items: [{ id: item.id, quantity: value }],
          })
        } else {
          await updateDismissedItems({ actionId: action.id, quantity: value })
        }
      } else {
        if (action) {
          // remove damaged item if value is unset and it was added before
          await removeDismissedItems(action.id)
        }
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button className="flex gap-2 px-2" variant="secondary" type="button">
          <div>
            <HeartBroken />
          </div>
          {!!item.detail.written_off_quantity && (
            <span>{item.detail.written_off_quantity}</span>
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
                      className="bg-ui-bg-field-component text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
