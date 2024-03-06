import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { TaxRate } from "@medusajs/medusa"
import { Button, Input } from "@medusajs/ui"
import { useAdminUpdateTaxRate } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import {
  RouteDrawer,
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

type EditTaxRateFormProps = {
  taxRate: TaxRate
}

const EditTaxRateSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  rate: z.union([z.string(), z.number()]).refine((value) => {
    if (value === "") {
      return true // we allow empty string and read it as null
    }

    const num = Number(value)

    if (num >= 0 && num <= 100) {
      return true
    }

    return false
  }, "Tax rate must be a number between 0 and 100"),
})

export const EditTaxRateForm = ({ taxRate }: EditTaxRateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditTaxRateSchema>>({
    defaultValues: {
      name: taxRate.name,
      code: taxRate.code || "",
      rate: taxRate.rate || "",
    },
    resolver: zodResolver(EditTaxRateSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateTaxRate(taxRate.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        ...data,
        rate: data.rate ? Number(data.rate) : null,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body className="flex flex-col gap-y-4">
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
            name="rate"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.rate")}</Form.Label>
                  <Form.Control>
                    <PercentageInput {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
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
                    <Input type="number" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
