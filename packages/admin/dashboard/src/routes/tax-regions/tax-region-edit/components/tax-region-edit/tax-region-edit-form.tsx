import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { Combobox } from "../../../../../components/inputs/combobox"
import { formatProvider } from "../../../../../lib/format-provider"
import { useUpdateTaxRegion } from "../../../../../hooks/api"

type TaxRegionEditFormProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

const TaxRegionEditSchema = z.object({
  provider_id: z.string().min(1),
})

export const TaxRegionEditForm = ({ taxRegion }: TaxRegionEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const taxProviders = useComboboxData({
    queryKey: ["tax_providers"],
    queryFn: (params) => sdk.admin.taxProvider.list(params),
    getOptions: (data) =>
      data.tax_providers.map((provider) => ({
        label: formatProvider(provider.id),
        value: provider.id,
      })),
  })

  const form = useForm<z.infer<typeof TaxRegionEditSchema>>({
    defaultValues: {
      provider_id: taxRegion.provider_id ?? undefined,
    },
    resolver: zodResolver(TaxRegionEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateTaxRegion(taxRegion.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        provider_id: values.provider_id,
      },
      {
        onSuccess: () => {
          toast.success(t("taxRegions.edit.successToast"))
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
      <KeyboundForm
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-6 overflow-auto">
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="provider_id"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("taxRegions.fields.taxProvider")}</Form.Label>
                  <Form.Control>
                    <Combobox
                      {...field}
                      options={taxProviders.options}
                      searchValue={taxProviders.searchValue}
                      onSearchValueChange={taxProviders.onSearchValueChange}
                      fetchNextPage={taxProviders.fetchNextPage}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
