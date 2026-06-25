import { Heading, Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { ChipInput } from "../../../../../components/inputs/chip-input"
import { CreateProductOptionSchema } from "./schema"

type CreateProductOptionDetailsProps = {
  form: UseFormReturn<CreateProductOptionSchema>
}

export const CreateProductOptionDetails = ({
  form,
}: CreateProductOptionDetailsProps) => {
  const { t } = useTranslation()

  return (
    <div className="mt-16 flex flex-col items-center px-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <div>
          <Heading>{t("productOptions.create.header")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("productOptions.create.hint")}
          </Text>
        </div>
        <Form.Field
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>
                  {t("productOptions.fields.title.label")}
                </Form.Label>
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
                <Form.Label>
                  {t("productOptions.fields.values.label")}
                </Form.Label>
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
    </div>
  )
}
