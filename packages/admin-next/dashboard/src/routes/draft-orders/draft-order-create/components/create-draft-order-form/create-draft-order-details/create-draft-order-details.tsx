import { Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { CreateDraftOrderAddressDetails } from "./create-draft-order-address-details"
import { CreateDraftOrderCustomerDetails } from "./create-draft-order-customer-details"
import { CreateDraftOrderItemsDetails } from "./create-draft-order-items-details"
import { CreateDraftOrderRegionDetails } from "./create-draft-order-region-details"
import { CreateDraftOrderShippingMethodDetails } from "./create-draft-order-shipping-method-details"

export const CreateDraftOrderDetails = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <div>
          <Heading>{t("draftOrders.create.createDraftOrder")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("draftOrders.create.createDraftOrderHint")}
          </Text>
        </div>
        <CreateDraftOrderRegionDetails />
        <Divider />
        <CreateDraftOrderCustomerDetails />
        <Divider />
        <CreateDraftOrderItemsDetails />
        <Divider />
        <CreateDraftOrderShippingMethodDetails />
        <Divider />
        <CreateDraftOrderAddressDetails />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div role="presentation" className="bg-ui-border-base h-px w-full" />
}
