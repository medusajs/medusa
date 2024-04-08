import { zodResolver } from "@hookform/resolvers/zod"
import { TaxRateResponse } from "@medusajs/types"
import { Button, Input, Switch } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { useNavigate } from "react-router-dom"
import { Form } from "../../../../components/common/form"
import { PercentageInput } from "../../../../components/common/percentage-input"
import { RouteDrawer, useRouteModal } from "../../../../components/route-modal"
import { useUpdateTaxRate } from "../../../../hooks/api/tax-rates"

type TaxRateEditFormProps = {
  taxRate: TaxRateResponse
}

const EditTaxRateSchema = zod.object({
  name: zod.string(),
  code: zod.string().optional(),
  rate: zod.number(),
  is_combinable: zod.boolean().default(false),
})

export const TaxRateEditForm = ({ taxRate }: TaxRateEditFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditTaxRateSchema>>({
    defaultValues: {
      name: taxRate.name,
      rate: taxRate.rate || undefined,
      code: taxRate.code || undefined,
      is_combinable: taxRate.is_combinable,
    },
    resolver: zodResolver(EditTaxRateSchema),
  })

  const { mutateAsync, isPending } = useUpdateTaxRate(taxRate.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        rate: data.rate,
        code: data.code,
      },
      {
        onSuccess: () => {
          handleSuccess(`/settings/taxes/${taxRate.tax_region_id}`)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
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
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="rate"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.rate")}</Form.Label>

                    <Form.Control>
                      <PercentageInput {...field} />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />

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

            {taxRate.tax_region?.parent_id && (
              <Form.Field
                control={form.control}
                name="is_combinable"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Is combinable?</Form.Label>

                      <Form.Control>
                        <Switch
                          {...field}
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            )}
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
