import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Divider } from "../../../../../../components/common/divider"
import { CreateDraftOrderCustomItemsSummary } from "./create-draft-order-custom-items-summary"
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
        <div className="flex flex-col gap-y-4">
          <Divider variant="dashed" />
          <CreateDraftOrderVariantItemsSummary />
          <CreateDraftOrderCustomItemsSummary />
          <CreateDraftOrderTotalSummary />
          <Divider variant="dashed" />
        </div>
        <CreateDraftOrderFieldsSummary />
      </div>
    </div>
  )
}
