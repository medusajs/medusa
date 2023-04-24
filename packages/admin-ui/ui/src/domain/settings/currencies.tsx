import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import Select from "../../components/molecules/select"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { currencies } from "../../utils/currencies"
import { getErrorMessage } from "../../utils/error-messages"
import BreadCrumb from "../../components/molecules/breadcrumb"
import TwoSplitPane from "../../components/templates/two-split-pane"

type SelectCurrency = {
  value: string
  label: string
}

const CurrencySettings = () => {
  const [storeCurrencies, setStoreCurrencies] = useState<SelectCurrency[]>([])
  const [allCurrencies, setAllCurrencies] = useState<SelectCurrency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<SelectCurrency>({
    value: "",
    label: "",
  })

  const notification = useNotification()
  const { isLoading, store } = useAdminStore()
  const updateStore = useAdminUpdateStore()

  const setCurrenciesOnLoad = () => {
    const defaultCurr = {
      label: store!.default_currency_code.toUpperCase(),
      value: store!.default_currency_code.toUpperCase(),
    }

    const storeCurrs =
      store?.currencies.map((c) => ({
        value: c.code.toUpperCase(),
        label: c.code.toUpperCase(),
      })) || []

    const allCurrs = Object.keys(currencies).map((currency) => ({
      label: currency,
      value: currency,
    }))

    setSelectedCurrency(defaultCurr)
    setStoreCurrencies(storeCurrs)
    setAllCurrencies(allCurrs)
  }

  useEffect(() => {
    if (isLoading || !store) {
      return
    }

    setCurrenciesOnLoad()
  }, [store, isLoading])

  const handleChange = (currencies) => {
    setStoreCurrencies(currencies)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    updateStore.mutate(
      {
        default_currency_code: selectedCurrency.value,
        currencies: storeCurrencies.map((c) => c.value),
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated currencies", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const currencyEvents = [
    {
      label: "Save",
      onClick: (e) => onSubmit(e),
    },
    {
      label: "Cancel changes",
      // TODO: reset wasn't defined here so commented this out
      // onClick: () => navigate(`${basePath}/settings`),
      // onClick: () =>
      //   reset({
      //     name: store?.name,
      //     swap_link_template: store?.swap_link_template,
      //     payment_link_template: store?.payment_link_template,
      //     invite_link_template: store?.invite_link_template,
      //   }),
    },
  ]

  return (
    <div>
      <BreadCrumb
        previousRoute="/admin/settings"
        previousBreadcrumb="Settings"
        currentPage="Admin Regions"
      />

      <TwoSplitPane>
        <BodyCard
          title="Store Currencies"
          subtitle="Manage the currencies that you will operate in"
          events={currencyEvents}
          className={"max-h-full"}
        >
          <Select
            label="Default store currency"
            options={storeCurrencies} // You are only allow to choose default currency from store currencies
            value={selectedCurrency}
            isMultiSelect={false}
            enableSearch={true}
            onChange={(e: SelectCurrency) => setSelectedCurrency(e)}
            className="mb-6"
          />
          <Select
            label="Store currencies"
            options={allCurrencies}
            value={storeCurrencies}
            isMultiSelect={true}
            enableSearch={true}
            onChange={handleChange}
            className="mb-2"
          />
        </BodyCard>
      </TwoSplitPane>
    </div>
  )
}

export default CurrencySettings
