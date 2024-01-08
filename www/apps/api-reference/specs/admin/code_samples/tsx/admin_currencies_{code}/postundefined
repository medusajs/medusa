import React from "react"
import { useAdminUpdateCurrency } from "medusa-react"

type Props = {
  currencyCode: string
}

const Currency = ({ currencyCode }: Props) => {
  const updateCurrency = useAdminUpdateCurrency(currencyCode)
  // ...

  const handleUpdate = (includes_tax: boolean) => {
    updateCurrency.mutate({
      includes_tax,
    }, {
      onSuccess: ({ currency }) => {
        console.log(currency)
      }
    })
  }

  // ...
}

export default Currency
