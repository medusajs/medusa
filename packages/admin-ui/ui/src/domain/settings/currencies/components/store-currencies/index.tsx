import { Store } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import Button from "../../../../../components/fundamentals/button"
import useToggleState from "../../../../../hooks/use-toggle-state"
import EditCurrenciesModal from "./edit-currencies-modal"

type Props = {
  store: Store
}

const StoreCurrencies = ({ store }: Props) => {
  const { t } = useTranslation()
  const { state, close, toggle } = useToggleState()

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="inter-large-semibold mb-2xsmall">
            {t("store-currencies-store-currencies", "Store currencies")}
          </h3>
          <p className="inter-base-regular text-grey-50">
            {t(
              "store-currencies-all-the-currencies-available-in-your-store",
              "All the currencies available in your store."
            )}
          </p>
        </div>
        <Button variant="secondary" size="small" onClick={toggle}>
          {t("store-currencies-edit-currencies", "Edit currencies")}
        </Button>
      </div>
      <EditCurrenciesModal store={store} open={state} onClose={close} />
    </>
  )
}

export default StoreCurrencies
