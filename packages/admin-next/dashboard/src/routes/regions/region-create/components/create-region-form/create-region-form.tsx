import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Switch, Text } from "@medusajs/ui"
import { useAdminCreateRegion } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type CreateRegionFormProps = {
  subscribe: (state: boolean) => void
}

const CreateRegionSchema = zod.object({
  name: zod.string().min(1),
  currency_code: zod.string(),
  includes_tax: zod.boolean(),
  countries: zod.array(zod.string()),
  fulfillment_providers: zod.array(zod.string()).min(1),
  payment_providers: zod.array(zod.string()).min(1),
  tax_rate: zod.number().min(0).max(1),
  tax_code: zod.string().optional(),
})

export const CreateRegionForm = ({ subscribe }: CreateRegionFormProps) => {
  const form = useForm<zod.infer<typeof CreateRegionSchema>>({
    defaultValues: {
      name: "",
      currency_code: "",
      includes_tax: false,
      countries: [],
      fulfillment_providers: [],
      payment_providers: [],
      tax_code: "",
    },
    resolver: zodResolver(CreateRegionSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty, subscribe])

  const { t } = useTranslation()
  const navigate = useNavigate()

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
        onSuccess: ({ region }) => {
          navigate(`../${region.id}`)
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </FocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("regions.createRegion")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("regions.createRegionHint")}
              </Text>
            </div>
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
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="currency_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.currency")}</Form.Label>
                        <Form.Control></Form.Control>
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
                          <Input type="number" {...field} />
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
                        <Form.Label optional>{t("fields.taxCode")}</Form.Label>
                        <Form.Control>
                          <Input type="number" {...field} />
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
                      <Form.Hint>{t("regions.taxInclusiveHint")}</Form.Hint>
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
          </div>
        </FocusModal.Body>
      </form>
    </Form>
  )
}
