import { adminStoreKeys, useAdminCustomQuery } from "medusa-react"

export const useV2Store = ({ initialData }: { initialData: any }) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery(
    "/admin/stores",
    adminStoreKeys.details(),
    {},
    { initialData }
  )

  const store = data.stores[0]

  return { store, isLoading, isError, error }
}

export const useV2StoreCurrencies = ({
  currencyCodes,
}: {
  currencyCodes: string[]
}) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/admin/currencies?code=${currencyCodes.join(",")}`,
    adminStoreKeys.details()
  )

  const currencies = data?.currencies

  return { currencies, isLoading, isError, error }
}
