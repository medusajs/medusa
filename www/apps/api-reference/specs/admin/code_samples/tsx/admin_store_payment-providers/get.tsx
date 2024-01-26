import React from "react"
import { useAdminStorePaymentProviders } from "medusa-react"

const PaymentProviders = () => {
  const {
    payment_providers,
    isLoading
  } = useAdminStorePaymentProviders()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {payment_providers && !payment_providers.length && (
        <span>No Payment Providers</span>
      )}
      {payment_providers &&
        payment_providers.length > 0 &&(
          <ul>
            {payment_providers.map((provider) => (
              <li key={provider.id}>{provider.id}</li>
            ))}
          </ul>
      )}
    </div>
  )
}

export default PaymentProviders
