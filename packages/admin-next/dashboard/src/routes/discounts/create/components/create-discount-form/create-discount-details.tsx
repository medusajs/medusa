import { Heading, Input, Text } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { CreateDiscountFormReturn } from "./create-discount-form.tsx"

type CreateDiscountPropsProps = {
  form: CreateDiscountFormReturn
}

export const CreateDiscountDetails = ({ form }: CreateDiscountPropsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
        <div className="flex flex-col gap-y-1">
          <Heading>{t("discount.createDiscountTitle")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("discounts.createDiscountHint")}
          </Text>
        </div>
        <div className="flex flex-col gap-y-8 divide-y [&>div]:pt-8">
          <div id="general" className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-4">
                <Form.Field
                  control={form.control}
                  name="code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.code")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.percentage")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  i18nKey="discounts.titleHint"
                  t={t}
                  components={[<br key="break" />]}
                />
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
