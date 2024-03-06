import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Region } from "@medusajs/medusa"
import { Button, Input } from "@medusajs/ui"
import { useAdminUpdateRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"

type EditDefaultTaxRateFormProps = {
  region: Region
}

const EditDefaultTaxRateSchema = z.object({
  tax_code: z.string().optional(),
  tax_rate: z.union([z.string(), z.number()]).refine((value) => {
    if (value === "") {
      return false
    }

    const num = Number(value)

    if (num >= 0 && num <= 100) {
      return true
    }

    return false
  }, "Tax rate must be a number between 0 and 100"),
})

export const EditDefaultTaxRateForm = ({
  region,
}: EditDefaultTaxRateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditDefaultTaxRateSchema>>({
    defaultValues: {
      tax_code: region.tax_code || "",
      tax_rate: region.tax_rate,
    },
    resolver: zodResolver(EditDefaultTaxRateSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateRegion(region.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        tax_code: data.tax_code,
        tax_rate: Number(data.tax_rate),
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
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="tax_rate"
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
              name="tax_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.code")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
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
