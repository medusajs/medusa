import { Button, CurrencyInput, Hint, Input, Label } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { SplitView } from "../../../../../../components/layout/split-view"
import { castNumber } from "../../../../../../lib/cast-number"
import { CustomItemSchema } from "../constants"
import { useCreateDraftOrder } from "../hooks"
import { CustomItem } from "../types"

export const AddCustomItemDrawer = () => {
  const { region, custom } = useCreateDraftOrder()
  const { currency } = region || {}

  const currencyCode = currency?.code || ""
  const nativeSymbol = currency?.symbol_native || ""

  const { t } = useTranslation()

  const [item, setItem] = useState<Partial<CustomItem>>({
    title: "",
    quantity: 1,
    unit_price: undefined,
  })
  const [errors, setErrors] = useState<z.ZodError<
    z.infer<typeof CustomItemSchema>
  > | null>(null)

  const handleSave = () => {
    const parsed = CustomItemSchema.safeParse(item)

    if (!parsed.success) {
      setErrors(parsed.error)

      return
    }

    custom.update(parsed.data)
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <div className="size-full flex-1 overflow-auto px-6 py-4">
        <div className="flex flex-col gap-y-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-y-2">
          <div>
            <Label weight="plus" size="small">
              {t("fields.title")}
            </Label>
            <Input
              value={item.title}
              onChange={(e) =>
                setItem((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <ErrorMessage errors={errors} field="title" />
          </div>
          <div>
            <Label weight="plus" size="small">
              {t("fields.quantity")}
            </Label>
            <Input
              value={item.quantity}
              type="number"
              step={1}
              onChange={(e) => {
                const val = castNumber(e.target.value)
                setItem((prev) => ({ ...prev, quantity: val }))
              }}
            />
            <ErrorMessage errors={errors} field="quantity" />
          </div>
          <div>
            <Label weight="plus" size="small">
              {t("fields.unitPrice")}
            </Label>
            <CurrencyInput
              code={currencyCode}
              symbol={nativeSymbol}
              value={item.unit_price}
              onValueChange={(value) => {
                setItem((prev) => ({ ...prev, unit_price: value }))
              }}
            />
            <ErrorMessage errors={errors} field="unit_price" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-2 border-t p-4">
        <SplitView.Close type="button" asChild>
          <Button variant="secondary" size="small">
            {t("actions.cancel")}
          </Button>
        </SplitView.Close>
        <Button size="small" type="button" onClick={handleSave}>
          {t("actions.add")}
        </Button>
      </div>
    </div>
  )
}

const getFirstErrorMessage = (
  errors: z.ZodError<z.infer<typeof CustomItemSchema>> | null,
  field: string
): string | null => {
  if (!errors) {
    return null
  }

  const fieldError = errors.errors.find((error) => error.path[0] === field)

  return fieldError ? fieldError.message : null
}

const ErrorMessage = ({
  field,
  errors,
}: {
  errors: z.ZodError<z.infer<typeof CustomItemSchema>> | null
  field: string
}) => {
  const message = getFirstErrorMessage(errors, field)

  return message ? <Hint variant="error">{message}</Hint> : null
}
