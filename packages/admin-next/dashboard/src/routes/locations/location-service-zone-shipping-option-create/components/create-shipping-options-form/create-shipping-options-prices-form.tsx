import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"

import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import { useShippingOptionPriceColumns } from "../../../common/hooks/use-shipping-option-price-columns"
import { CreateShippingOptionSchema } from "./schema"

type PricingPricesFormProps = {
  form: UseFormReturn<CreateShippingOptionSchema>
}

export const CreateShippingOptionsPricesForm = ({
  form,
}: PricingPricesFormProps) => {
  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const currencies = useMemo(
    () => store?.supported_currency_codes || [],
    [store]
  )

  const {
    regions,
    isLoading: isRegionsLoading,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({
    fields: "id,name,currency_code",
    limit: 999,
  })

  const columns = useShippingOptionPriceColumns({
    currencies,
    regions,
  })

  const initializing = isStoreLoading || !store || isRegionsLoading || !regions

  const data = useMemo(
    () => [[...(currencies || []), ...(regions || [])]],
    [currencies, regions]
  )

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGridRoot data={data} columns={columns} state={form} />
    </div>
  )
}
