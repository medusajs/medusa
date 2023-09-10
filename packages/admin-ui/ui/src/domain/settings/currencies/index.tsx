import BackButton from "../../../components/atoms/back-button"
import { useTranslation } from "react-i18next"
import CurrencyTaxSetting from "./components/currency-tax-setting"
import DefaultStoreCurrency from "./components/default-store-currency"
import FeatureToggle from "../../../components/fundamentals/feature-toggle"
import JSONView from "../../../components/molecules/json-view"
import Section from "../../../components/organisms/section"
import Spinner from "../../../components/atoms/spinner"
import StoreCurrencies from "./components/store-currencies"
import Tooltip from "../../../components/atoms/tooltip"
import { getErrorStatus } from "../../../utils/get-error-status"
import { useAdminStore } from "medusa-react"
import { useAnalytics } from "../../../providers/analytics-provider"
import { useNavigate } from "react-router-dom"

const CurrencySettings = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { trackCurrencies } = useAnalytics()
  const { store, status, error } = useAdminStore({
    onSuccess: (data) => {
      trackCurrencies({
        used_currencies: data.store.currencies.map((c) => c.code),
      })
    },
  })

  if (error) {
    let message = t(
      "currencies-an-unknown-error-occurred",
      "An unknown error occurred"
    )

    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      message = errorStatus.message

      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // temp needs design
    return (
      <Section title={t("currencies-error", "Error")}>
        <p className="inter-base-regular">{message}</p>

        <div className="mt-base px-base py-xsmall">
          <JSONView data={JSON.parse(JSON.stringify(error))} />
        </div>
      </Section>
    )
  }

  if (status === "loading" || !store) {
    // temp, perhaps use skeletons?
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-xlarge">
      <BackButton
        label={t("currencies-back-to-settings", "Back to Settings")}
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="gap-base grid grid-cols-3">
        <div className="gap-y-xsmall col-span-2 flex flex-col ">
          <Section title="Currencies">
            <p className="text-grey-50 inter-base-regular mt-2xsmall">
              {t(
                "currencies-manage-the-markets-that-you-will-operate-within",
                "Manage the markets that you will operate within."
              )}
            </p>
          </Section>

          <Section>
            <div className="mb-large">
              <StoreCurrencies store={store} />
            </div>
            <div className="cursor-default">
              <div className="inter-small-semibold text-grey-50 mb-base flex items-center justify-between">
                <p>Currency</p>
                <FeatureToggle featureFlag="tax_inclusive_pricing">
                  <Tooltip
                    side="top"
                    content={t(
                      "currencies-include-or-exclude-taxes",
                      "Decide if you want to include or exclude taxes whenever you define a price in this currency"
                    )}
                  >
                    <p>{t("currencies-tax-incl-prices", "Tax Incl. Prices")}</p>
                  </Tooltip>
                </FeatureToggle>
              </div>
              <div className="gap-base grid grid-cols-1">
                {store.currencies
                  .sort((a, b) => {
                    return a.code > b.code ? 1 : -1
                  })
                  .map((c, index) => {
                    return (
                      <CurrencyTaxSetting
                        currency={c}
                        isDefault={store.default_currency_code === c.code}
                        key={index}
                      />
                    )
                  })}
              </div>
            </div>
          </Section>
        </div>
        <div>
          <Section>
            <DefaultStoreCurrency store={store} />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default CurrencySettings
