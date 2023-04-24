import React from "react"
import { useStorePermissions } from "../../../../../hooks/use-store-permissions"
import { NestedForm } from "../../../../../utils/nested-form"
import PricesForm, { PricesFormType } from "../../prices-form"

type Props = {
  form: NestedForm<PricesFormType>
}

const VariantPricesForm = ({ form }: Props) => {
  const { allowRegionPricing } = useStorePermissions()
  return (
    <div className="pt-large">
      <PricesForm form={form} allowRegionPricing={allowRegionPricing} />
    </div>
  )
}

export default VariantPricesForm
