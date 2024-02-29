import { zodResolver } from "@hookform/resolvers/zod"
import { Discount } from "@medusajs/medusa"
import { CurrencyInput, Button, Input, Text, Textarea } from "@medusajs/ui"
import { useAdminUpdateDiscount } from "medusa-react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../../../lib/money-amount-helpers.ts"
import { getCurrencySymbol } from "../../../../../lib/currencies.ts"

type EditDiscountFormProps = {
  discount: Discount
}

const EditDiscountSchema = zod.object({
  code: zod.string().min(1),
  description: zod.string(),
  value: zod.number(),
})

export const EditDiscountDetailsForm = ({
  discount,
}: EditDiscountFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const isFixedDiscount = discount.rule.type === "fixed"
  const isFreeShipping = discount.rule.type === "free_shipping"

  const form = useForm<zod.infer<typeof EditDiscountSchema>>({
    defaultValues: {
      code: discount.code,
      description: discount.rule.description || "",
      value: isFixedDiscount
        ? getPresentationalAmount(
            discount.rule.value,
            discount.regions[0].currency_code
          )
        : discount.rule.value,
    },
    resolver: zodResolver(EditDiscountSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateDiscount(discount.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        code: data.code,
        rule: {
          id: discount.rule.id,
          description: data.description,
          value: isFixedDiscount
            ? getDbAmount(data.value, discount.regions[0].currency_code)
            : (data.value as number),
        },
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
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
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  t={t}
                  i18nKey="discounts.titleHint"
                  components={[<br key="break" />]}
                />
              </Text>
            </div>

            {!isFreeShipping && (
              <Form.Field
                control={form.control}
                name="value"
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {isFixedDiscount
                          ? t("fields.amount")
                          : t("fields.percentage")}
                      </Form.Label>
                      <Form.Control>
                        {isFixedDiscount ? (
                          <CurrencyInput
                            min={0}
                            onValueChange={onChange}
                            code={discount.regions[0].currency_code}
                            symbol={getCurrencySymbol(
                              discount.regions[0].currency_code
                            )}
                            {...field}
                          />
                        ) : (
                          <Input
                            onChange={onChange}
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                          />
                        )}
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            )}

            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
