import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { CreateDraftOrderCustomerSummary } from "./create-draft-order-customer-summary"
import { CreateDraftOrderFieldsSummary } from "./create-draft-order-fields-summary"
import { CreateDraftOrderTotalSummary } from "./create-draft-order-total-summary"
import { CreateDraftOrderVariantItemsSummary } from "./create-draft-order-variant-items-summary"

export const CreateDraftOrderSummary = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <Heading>{t("fields.summary")}</Heading>
        <CreateDraftOrderCustomerSummary />
        <Divider />
        <CreateDraftOrderVariantItemsSummary />
        <Divider />
        <CreateDraftOrderTotalSummary />
        <Divider />
        <CreateDraftOrderFieldsSummary />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full border-t border-dashed" />
}
