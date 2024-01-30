import React from "react"
import { useAdminStoreTaxProviders } from "medusa-react"

const TaxProviders = () => {
  const {
    tax_providers,
    isLoading
  } = useAdminStoreTaxProviders()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {tax_providers && !tax_providers.length && (
        <span>No Tax Providers</span>
      )}
      {tax_providers &&
        tax_providers.length > 0 &&(
          <ul>
            {tax_providers.map((provider) => (
              <li key={provider.id}>{provider.id}</li>
            ))}
          </ul>
      )}
    </div>
  )
}

export default TaxProviders
