import { zodResolver } from "@hookform/resolvers/zod"
import { Button, ProgressTabs } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreatePriceList } from "../../../../../hooks/api/price-lists"
import { PricingDetailsForm } from "./pricing-details-form"
import { PricingPricesForm } from "./pricing-prices-form"
import { PricingProductsForm } from "./pricing-products-form"
import { PricingCreateSchema, PricingCreateSchemaType } from "./schema"

enum Tabs {
  DETAILS = "details",
  PRODUCTS = "products",
  PRICES = "prices",
}

export const PricingCreateForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<PricingCreateSchemaType>({
    defaultValues: {
      type: "sale",
      title: "",
      description: "",
      starts_at: null,
      ends_at: null,
      product_ids: [],
      products: {},
    },
    resolver: zodResolver(PricingCreateSchema),
  })

  const { mutateAsync, isPending } = useCreatePriceList()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        title: data.title,
        description: data.description,
        starts_at: data.starts_at ? data.starts_at.toISOString() : null,
        ends_at: data.ends_at ? data.ends_at.toISOString() : null,
      },
      {
        onSuccess: ({ price_list }) => {
          handleSuccess(`../${price_list.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs className="flex h-full flex-col overflow-hidden">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[400px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-3">
                  <ProgressTabs.Trigger value={Tabs.DETAILS}>
                    Details
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger value={Tabs.PRODUCTS}>
                    Products
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger value={Tabs.PRICES}>
                    Prices
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <RouteFocusModal.Close asChild>
                  <Button variant="secondary" size="small">
                    {t("actions.cancel")}
                  </Button>
                </RouteFocusModal.Close>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  isLoading={isPending}
                >
                  {t("actions.save")}
                </Button>
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tabs.DETAILS}
            >
              <PricingDetailsForm form={form} />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-y-auto"
              value={Tabs.PRODUCTS}
            >
              <PricingProductsForm form={form} />
            </ProgressTabs.Content>
            <ProgressTabs.Content
              className="size-full overflow-hidden"
              value={Tabs.PRICES}
            >
              <PricingPricesForm form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </form>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
