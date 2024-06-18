import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import { RouteDrawer } from "../../../../../components/route-modal"

type TaxRegionEditFormProps = {
  taxRegion: HttpTypes.AdminTaxRegion
  isSubLevel?: boolean
}

const TaxRegionEditFormSchema = z.object({
  name: z.string().min(1),
  country_code: z.string().min(2).optional(),
  province_code: z.string().min(1).optional(),
  is_combinable: z.boolean().optional(),
  rate: z.
})

export const TaxRegionEditForm = ({
  taxRegion,
  isSubLevel = false,
}: TaxRegionEditFormProps) => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof TaxRegionEditFormSchema>>({
    defaultValues: {
      name: taxRegion?.name || "",
      country_code: isSubLevel ? undefined : taxRegion?.country_code || "",
      province_code: isSubLevel ? taxRegion?.province_code || "" : undefined,
      is_combinable: isSubLevel ? taxRegion?.is_combinable : undefined,
    },
    resolver: zodResolver(TaxRegionEditFormSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {})

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-col gap-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <Form.Field
              control={form.control}
              name="country_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.country")}</Form.Label>
                    <Form.Control>
                      <CountrySelect {...field} />
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
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
