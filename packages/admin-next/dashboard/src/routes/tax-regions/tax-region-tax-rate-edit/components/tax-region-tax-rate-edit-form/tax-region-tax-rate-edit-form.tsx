import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useUpdateTaxRate } from "../../../../../hooks/api/tax-rates"

type TaxRegionTaxRateEditFormProps = {
  taxRate: HttpTypes.AdminTaxRate
}

const TaxRegionTaxRateEditSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  rate: z.object({
    float: z.number().optional(),
    value: z.string().optional(),
  }),
})

export const TaxRegionTaxRateEditForm = ({
  taxRate,
}: TaxRegionTaxRateEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof TaxRegionTaxRateEditSchema>>({
    defaultValues: {
      name: taxRate.name,
      code: taxRate.code || "",
      rate: {
        value: taxRate.rate?.toString() || "",
      },
    },
    resolver: zodResolver(TaxRegionTaxRateEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateTaxRate(taxRate.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        code: values.code || null,
        rate: values.rate?.float,
      },
      {
        onSuccess: () => {
          toast.success(t("taxRegions.taxRates.edit.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
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
            name="code"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("taxRegions.fields.taxCode")}</Form.Label>
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
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("taxRegions.fields.taxRate")}</Form.Label>
                  <Form.Control>
                    <PercentageInput
                      {...field}
                      value={value?.value}
                      onValueChange={(value, _name, values) =>
                        onChange({
                          value: value,
                          float: values?.float,
                        })
                      }
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
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
