import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Text } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../components/common/form"
import { StackedFocusModal } from "../../../components/modals"
import { KeyboundForm } from "../../../components/utilities/keybound-form"
import { TieredPriceFormProps, TieredPriceSchema } from "./types"
import { TieredPriceList } from "./tiered-price-list"
import { TieredPriceItem } from "./tiered-price-item"
import { getRuleValue } from "./tiered-price-list"

export const TieredPriceForm = <T extends TieredPriceSchema>({
  schema,
  initialValues,
  onSubmit,
  onClose,
  currency,
  header,
  description,
  addPriceLabel,
  fieldConfig,
  defaultRow,
  renderConditionItem,
  renderConditionTrigger,
}: TieredPriceFormProps<T>) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<string[]>([getRuleValue(0)])

  const emptyRow =
    defaultRow ??
    ({ amount: "", [fieldConfig.min]: "", [fieldConfig.max]: null } as any)

  const form = useForm<z.infer<T>>({
    defaultValues: {
      prices: initialValues.length > 0 ? initialValues : [emptyRow],
    } as any,
    resolver: zodResolver(schema),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices" as any,
  })

  const handleAdd = () => {
    append(emptyRow as any)

    setValue([...value, getRuleValue(fields.length)])
  }

  const handleRemove = (index: number) => {
    remove(index)
  }

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    try {
      await form.handleSubmit(
        (values) => {
          onSubmit(values)
          onClose()
        },
        (e) => {
          const indexesWithErrors = Object.keys(e.prices || {})
          setValue((prev) => {
            const values = new Set(prev)

            indexesWithErrors.forEach((index) => {
              values.add(getRuleValue(Number(index)))
            })

            return Array.from(values)
          })
        }
      )(event)
    } catch (error) {
      console.error("Unexpected form submission error:", error)
    }
  }

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.stopPropagation()
      handleSubmit()
    }
  }

  return (
    <Form {...form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        onKeyDown={handleOnKeyDown}
        className="flex h-full flex-col"
      >
        <StackedFocusModal.Content>
          <StackedFocusModal.Header />
          <StackedFocusModal.Body className="size-full overflow-hidden">
            <div className="flex size-full flex-1 flex-col items-center overflow-y-auto">
              <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-6 py-16">
                <div className="flex w-full flex-col gap-y-6">
                  <div>
                    <StackedFocusModal.Title asChild>
                      <Heading>{header}</Heading>
                    </StackedFocusModal.Title>
                    <StackedFocusModal.Description asChild>
                      <Text size="small" className="text-ui-fg-subtle">
                        {description}
                      </Text>
                    </StackedFocusModal.Description>
                  </div>
                  <TieredPriceList value={value} onValueChange={setValue}>
                    {fields.map((field, index) => (
                      <TieredPriceItem
                        key={field.id}
                        index={index}
                        onRemove={handleRemove}
                        currency={currency}
                        control={form.control}
                        triggerContent={renderConditionTrigger({
                          index,
                          control: form.control,
                          currency,
                        })}
                      >
                        {renderConditionItem({
                          index,
                          control: form.control,
                          currency,
                        })}
                      </TieredPriceItem>
                    ))}
                  </TieredPriceList>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      onClick={handleAdd}
                    >
                      {addPriceLabel}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </StackedFocusModal.Body>
          <StackedFocusModal.Footer>
            <div className="flex items-center justify-end gap-2">
              <StackedFocusModal.Close asChild>
                <Button variant="secondary" size="small" type="button">
                  {t("actions.cancel")}
                </Button>
              </StackedFocusModal.Close>
              <Button size="small" type="button" onClick={handleSubmit}>
                {t("actions.save")}
              </Button>
            </div>
          </StackedFocusModal.Footer>
        </StackedFocusModal.Content>
      </KeyboundForm>
    </Form>
  )
}
