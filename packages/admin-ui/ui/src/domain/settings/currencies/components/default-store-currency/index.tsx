import { Store } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import DefaultCurrencySelector from "./default-currency-selector"

type Props = {
  store: Store
}

const DefaultStoreCurrency = ({ store }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="gap-y-large flex flex-col">
      <div>
        <h3 className="inter-large-semibold mb-2xsmall">
          {t(
            "default-store-currency-default-store-currency",
            "Default store currency"
          )}
        </h3>
        <p className="inter-base-regular text-grey-50">
          {t(
            "default-store-currency-this-is-the-currency-your-prices-are-shown-in",
            "This is the currency your prices are shown in."
          )}
        </p>
      </div>

      <DefaultCurrencySelector store={store} />
    </div>
  )
}

export default DefaultStoreCurrency
