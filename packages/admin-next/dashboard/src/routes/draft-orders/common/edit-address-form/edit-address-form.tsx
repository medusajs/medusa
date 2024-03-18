import { zodResolver } from "@hookform/resolvers/zod"
import { Country, DraftOrder } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useAdminUpdateDraftOrder } from "medusa-react"
import { DefaultValues, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { AddressForm } from "../../../../components/forms/address-form"
import { RouteDrawer, useRouteModal } from "../../../../components/route-modal"
import { AddressSchema } from "../../../../lib/schemas"

type AddressType = "shipping" | "billing"

type EditDraftOrderAddressFormProps = {
  draftOrder: DraftOrder
  countries: Country[]
  type: AddressType
}

export const EditDraftOrderAddressForm = ({
  draftOrder,
  countries,
  type,
}: EditDraftOrderAddressFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof AddressSchema>>({
    defaultValues: getDefaultValues(draftOrder, type),
    resolver: zodResolver(AddressSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateDraftOrder(draftOrder.id)

  const handleSumbit = form.handleSubmit(async (values) => {
    const update = {
      [type === "shipping" ? "shipping_address" : "billing_address"]: values,
    }

    mutateAsync(update, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSumbit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full flex-1 overflow-auto">
          <AddressForm
            control={form.control}
            countries={countries}
            layout="stack"
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" isLoading={isLoading} size="small">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}

const getDefaultValues = (
  draftOrder: DraftOrder,
  type: AddressType
): DefaultValues<z.infer<typeof AddressSchema>> => {
  const address =
    type === "shipping"
      ? draftOrder.cart.shipping_address
      : draftOrder.cart.billing_address

  return {
    first_name: address?.first_name ?? "",
    last_name: address?.last_name ?? "",
    address_1: address?.address_1 ?? "",
    address_2: address?.address_2 ?? "",
    city: address?.city ?? "",
    postal_code: address?.postal_code ?? "",
    province: address?.province ?? "",
    country_code: address?.country_code ?? "",
    phone: address?.phone ?? "",
    company: address?.company ?? "",
  }
}
