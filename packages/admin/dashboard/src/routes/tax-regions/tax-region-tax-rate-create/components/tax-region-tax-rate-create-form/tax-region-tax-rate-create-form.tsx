import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateTaxRate } from "../../../../../hooks/api/tax-rates"

type TaxRegionTaxRateCreateFormProps = {
  taxRegion: HttpTypes.AdminTaxRegion
  isSublevel?: boolean
}

const TaxRegionTaxRateCreateSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  rate: z
    .object({
      float: z.number().optional(),
      value: z.string().optional(),
    })
    .optional(),
  is_combinable: z.boolean().optional(),
})

export const TaxRegionTaxRateCreateForm = ({
  taxRegion,
  isSublevel = false,
}: TaxRegionTaxRateCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof TaxRegionTaxRateCreateSchema>>({
    defaultValues: {
      name: "",
      code: "",
      rate: {
        value: "",
      },
      is_combinable: false,
    },
    resolver: zodResolver(TaxRegionTaxRateCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        tax_region_id: taxRegion.id,
        is_default: true,
        name: values.name,
        code: values.code || undefined,
        rate: values.rate?.float,
        is_combinable: values.is_combinable,
      },
      {
        onSuccess: () => {
          toast.success(t("taxRegions.taxRates.create.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading>{t(`taxRegions.taxRates.create.header`)}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t(`taxRegions.taxRates.create.hint`)}
                </Text>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("taxRegions.fields.taxRate")}
                        </Form.Label>
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
                <Form.Field
                  control={form.control}
                  name="code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("taxRegions.fields.taxCode")}
                        </Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              {isSublevel && (
                <SwitchBox
                  control={form.control}
                  name="is_combinable"
                  label={t("taxRegions.fields.isCombinable.label")}
                  description={t("taxRegions.fields.isCombinable.hint")}
                />
              )}
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
