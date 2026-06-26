import { Input } from "@medusajs/ui"
import { useEffect } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { ChipInput } from "../../../../../components/inputs/chip-input"
import { EditProductOptionSchema } from "./schema"

type EditProductOptionDetailsProps = {
  form: UseFormReturn<EditProductOptionSchema>
}

export const EditProductOptionDetails = ({
  form,
}: EditProductOptionDetailsProps) => {
  const { t } = useTranslation()

  const values = useWatch({
    control: form.control,
    name: "values",
  })

  const valueRanks = useWatch({
    control: form.control,
    name: "value_ranks",
  })

  useEffect(() => {
    if (!values || !valueRanks) {
      return
    }

    const validValueSet = new Set(values)
    const currentRanks = { ...valueRanks }
    let hasStaleEntries = false

    Object.keys(currentRanks).forEach((key) => {
      if (!validValueSet.has(key)) {
        delete currentRanks[key]
        hasStaleEntries = true
      }
    })

    if (hasStaleEntries) {
      form.setValue("value_ranks", currentRanks, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }, [values, valueRanks, form])

  return (
    <div className="flex flex-col gap-y-4">
      <Form.Field
        control={form.control}
        name="title"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("productOptions.fields.title.label")}</Form.Label>
              <Form.Control>
                <Input
                  autoComplete="off"
                  {...field}
                  placeholder={t("productOptions.fields.title.placeholder")}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="values"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("productOptions.fields.values.label")}</Form.Label>
              <Form.Control>
                <ChipInput
                  {...field}
                  placeholder={t("productOptions.fields.values.placeholder")}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
