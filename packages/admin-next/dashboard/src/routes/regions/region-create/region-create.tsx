import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Switch, Text } from "@medusajs/ui"
import { useAdminCreateRegion } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../components/common/form"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

const NewRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  includes_tax: zod.boolean(),
  countries: zod.array(zod.string()),
  fulfillment_providers: zod.array(zod.string()).min(1),
  payment_providers: zod.array(zod.string()).min(1),
  tax_rate: zod.number().min(0).max(100),
  tax_code: zod.string().optional(),
})

const schema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  includes_tax: zod.boolean(),
  countries: zod.array(zod.string()),
  fulfillment_providers: zod.array(zod.string()).min(1),
  payment_providers: zod.array(zod.string()).min(1),
  tax_rate: zod.number().min(0).max(100),
  tax_code: zod.string().optional(),
})

export const RegionCreate = () => {
  const [open, onOpenChange] = useRouteModalState()

  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof schema>>({
    defaultValues: {
      name: "",
      currency_code: "",
      includes_tax: false,
      countries: [],
      fulfillment_providers: [],
      payment_providers: [],
      tax_code: "",
    },
    resolver: zodResolver(NewRegionSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateRegion()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        countries: values.countries,
        currency_code: values.currency_code,
        fulfillment_providers: values.fulfillment_providers,
        payment_providers: values.payment_providers,
        tax_rate: values.tax_rate,
        tax_code: values.tax_code,
        includes_tax: values.includes_tax,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  })

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    {t("general.cancel")}
                  </Button>
                </FocusModal.Close>
                <Button size="small" type="submit" isLoading={isLoading}>
                  {t("general.save")}
                </Button>
              </div>
            </FocusModal.Header>
            <FocusModal.Body className="flex flex-col items-center pt-[72px]">
              <div className="w-full max-w-[720px]">
                <Heading></Heading>
                <div>
                  <div className="flex flex-col gap-y-10">
                    <div className="flex flex-col gap-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Form.Field
                          control={form.control}
                          name="name"
                          render={({ field }) => {
                            return (
                              <Form.Item>
                                <Form.Label>{t("fields.name")}</Form.Label>
                                <Form.Control>
                                  <Input size="small" {...field} />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Form.Field
                          control={form.control}
                          name="tax_rate"
                          render={({ field }) => {
                            return (
                              <Form.Item>
                                <Form.Label>{t("fields.taxRate")}</Form.Label>
                                <Form.Control>
                                  <Input
                                    type="number"
                                    size="small"
                                    {...field}
                                  />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                        <Form.Field
                          control={form.control}
                          name="tax_code"
                          render={({ field }) => {
                            return (
                              <Form.Item>
                                <Form.Label optional>
                                  {t("fields.taxCode")}
                                </Form.Label>
                                <Form.Control>
                                  <Input
                                    type="number"
                                    size="small"
                                    {...field}
                                  />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                      </div>
                    </div>
                    <Form.Field
                      control={form.control}
                      name="includes_tax"
                      render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <div>
                              <div className="flex items-start justify-between">
                                <Form.Label>
                                  {t("fields.taxInclusivePricing")}
                                </Form.Label>
                                <Form.Control>
                                  <Switch
                                    {...field}
                                    checked={value}
                                    onCheckedChange={onChange}
                                  />
                                </Form.Control>
                              </div>
                              <Form.Hint>
                                {t("regions.taxInclusiveHint")}
                              </Form.Hint>
                              <Form.ErrorMessage />
                            </div>
                          </Form.Item>
                        )
                      }}
                    />
                    <div className="flex flex-col gap-y-4">
                      <div>
                        <Text size="small" leading="compact" weight="plus">
                          {t("fields.providers")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("regions.providersHint")}
                        </Text>
                      </div>
                      <div className="grid grid-cols-2 gap-4"></div>
                    </div>
                    <div className="flex flex-col gap-y-4">
                      <div>
                        <Text size="small" leading="compact" weight="plus">
                          {t("fields.metadata")}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FocusModal.Body>
          </form>
        </Form>
      </FocusModal.Content>
    </FocusModal>
  )
}
