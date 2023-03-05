import { Store } from "@medusajs/medusa"
import { useAdminUpdateStore } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import useNotification from "../../../../../hooks/use-notification"
import { Option } from "../../../../../types/shared"
import { getErrorMessage } from "../../../../../utils/error-messages"

type Props = {
  store: Store
}

type DefaultStoreCurrencyFormType = {
  default_currency_code: Option & { prefix: string }
}

const DefaultCurrencySelector = ({ store }: Props) => {
  const { reset, control, handleSubmit } = useForm<
    DefaultStoreCurrencyFormType
  >({
    defaultValues: getDefaultValue(store),
  })

  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValue(store))
  }, [store])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        default_currency_code: data.default_currency_code.value,
      },
      {
        onSuccess: () => {
          notification(
            "Success",
            "Successfully updated default currency",
            "success"
          )
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  const currencyOptions = useMemo(() => {
    return store.currencies.map((currency) => {
      return {
        value: currency.code,
        label: currency.name,
        prefix: currency.code.toUpperCase(),
      }
    })
  }, [store])

  return (
    <div>
      <Controller
        control={control}
        name="default_currency_code"
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <NextSelect
              placeholder="Choose default currency"
              options={currencyOptions}
              value={value}
              onChange={(e) => {
                onChange(e)
                onSubmit()
              }}
              onBlur={onBlur}
            />
          )
        }}
      />
    </div>
  )
}

const getDefaultValue = (store: Store): DefaultStoreCurrencyFormType => {
  return {
    default_currency_code: {
      value: store.default_currency_code,
      label: store.default_currency.name,
      prefix: store.default_currency.code.toUpperCase(),
    },
  }
}

export default DefaultCurrencySelector
