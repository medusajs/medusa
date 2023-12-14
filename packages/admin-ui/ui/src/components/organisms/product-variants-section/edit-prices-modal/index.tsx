import { MoneyAmount, Product } from "@medusajs/client-types"
import {
  useAdminRegions,
  useAdminStore,
  useAdminUpdateVariant,
} from "medusa-react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  getAllProductPricesCurrencies,
  getAllProductPricesRegions,
  getCurrencyPricesOnly,
  getRegionPricesOnly,
} from "./utils"

import mapKeys from "lodash/mapKeys"
import pick from "lodash/pick"
import pickBy from "lodash/pickBy"
import useNotification from "../../../../hooks/use-notification"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import Fade from "../../../atoms/fade-wrapper"
import Button from "../../../fundamentals/button"
import CrossIcon from "../../../fundamentals/icons/cross-icon"
import Modal from "../../../molecules/modal"
import DeletePrompt from "../../delete-prompt"
import EditPricesActions from "./edit-prices-actions"
import EditPricesTable from "./edit-prices-table"
import SavePrompt from "./save-prompt"

type EditPricesModalProps = {
  close: () => void
  product: Product
}

/**
 * Return map of regionIds <> currency_codes
 */
function useRegionsCurrencyMap() {
  const map = {}
  const { regions: storeRegions } = useAdminRegions({
    limit: 1000,
  })

  storeRegions?.forEach((r) => {
    map[r.id] = r.currency_code
  })

  return useMemo(() => map, [storeRegions])
}

/**
 * Edit prices modal container.
 */
function EditPricesModal(props: EditPricesModalProps) {
  const editedPrices = useRef({})

  const { regions: storeRegions } = useAdminRegions({
    limit: 1000,
  })
  const { store } = useAdminStore()

  const regionCurrenciesMap = useRegionsCurrencyMap()
  const regions = getAllProductPricesRegions(props.product).sort()
  const currencies = getAllProductPricesCurrencies(props.product).sort()

  const notification = useNotification()
  const updateVariant = useAdminUpdateVariant(props.product.id)

  const [showCloseConfirmationPrompt, setShowCloseConfirmationPrompt] =
    useState(false)
  const [showSaveConfirmationPrompt, setShowSaveConfirmationPrompt] =
    useState(false)

  const initialCurrencies =
    !currencies.length && !regions.length
      ? store?.currencies.map((c) => c.code)
      : currencies

  const [selectedCurrencies, setSelectedCurrencies] =
    useState(initialCurrencies)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regions)

  const toggleCurrency = (currencyCode: string) => {
    const set = new Set(selectedCurrencies)
    if (set.has(currencyCode)) {
      set.delete(currencyCode)
    } else {
      set.add(currencyCode)
    }

    setSelectedCurrencies(Array.from(set))
  }

  const toggleRegion = (regionId: string) => {
    const set = new Set(selectedRegions)
    if (set.has(regionId)) {
      set.delete(regionId)
    } else {
      set.add(regionId)
    }

    setSelectedRegions(Array.from(set))
  }

  const onPriceUpdate = (prices: Record<string, number | undefined>) => {
    editedPrices.current = prices
  }

  const onSave = () => {
    detectHiddenEditedColumns()
    setShowSaveConfirmationPrompt(true)
  }

  const detectHiddenEditedColumns = () => {
    const initialState = {}

    // figure out which price cells were initially populated
    props.product.variants!.forEach((variant) => {
      currencies.forEach((c) => {
        const currencyMetadata = CURRENCY_MAP[c.toUpperCase()]

        const ma = getCurrencyPricesOnly(variant.prices!).find(
          (p) => p.currency_code === c
        )

        if (ma) {
          initialState[`${variant.id}-${c}`] =
            ma.amount / Math.pow(10, currencyMetadata.decimal_digits)
        }
      })

      regions.forEach((r) => {
        const ma = getRegionPricesOnly(variant.prices!).find(
          (p) => p.region_id === r
        )

        if (ma) {
          const currencyMetadata = CURRENCY_MAP[ma.currency_code.toUpperCase()]
          initialState[`${variant.id}-${r}`] =
            ma.amount / Math.pow(10, currencyMetadata.decimal_digits)
        }
      })
    })

    const diff = { ...editedPrices.current }

    // all prices that differ from the initial populated value are changed prices
    Object.keys(initialState).forEach((k) => {
      if (initialState[k] === diff[k]) {
        delete diff[k]
      }
    })

    const dirtyColumns = [
      ...new Set(Object.keys(diff).map((k) => k.split("-")[1])),
    ]

    const hiddenDirtyColumns = dirtyColumns.filter(
      (c) => !selectedCurrencies.includes(c) && !selectedRegions.includes(c)
    )

    return hiddenDirtyColumns.map((c) => {
      if (c.length === 3) {
        return c.toUpperCase()
      } else {
        return storeRegions?.find((r) => r.id === c)?.name || c
      }
    })
  }

  const save = (saveOnlyVisible?: boolean) => {
    const pricesEditMap: Record<string, number | undefined> =
      editedPrices.current
    const variants = props.product.variants!

    const promises = variants.map((variant) => {
      const variantPrices = variant.prices!.filter((p) => !p.price_list_id)
      // pick price edits that are related to the current variant
      const variantPricesEditMap = mapKeys(
        pickBy(pricesEditMap, (_, k) => k.includes(variant.id)),
        (_, k) => k.split("-")[1]
      )

      const currencyPriceEdits = pickBy(
        variantPricesEditMap,
        (o, k) =>
          !k.startsWith("reg") &&
          (saveOnlyVisible ? selectedCurrencies.includes(k) : true)
      )

      const regionPriceEdits = pickBy(
        variantPricesEditMap,
        (o, k) =>
          k.startsWith("reg") &&
          (saveOnlyVisible ? selectedRegions.includes(k) : true)
      )

      const pricesPayload: Partial<MoneyAmount>[] = []

      variantPrices.forEach((price) => {
        if (price.region_id) {
          // region price

          if (price.region_id in regionPriceEdits) {
            // this MA is edited - UPDATE CASE

            if (typeof regionPriceEdits[price.region_id] === "number") {
              const p = { ...price }
              const num =
                regionPriceEdits[price.region_id]! *
                Math.pow(
                  10,
                  CURRENCY_MAP[price.currency_code.toUpperCase()].decimal_digits
                )

              p.amount = parseFloat(num.toFixed(0))

              pricesPayload.push(p)
            } else {
              // amount is unset -> DELETED case just skip
            }
          } else {
            pricesPayload.push(price) // not edited just send it so it's not deleted
          }

          delete regionPriceEdits[price.region_id]
        } else {
          // currency price

          if (price.currency_code in currencyPriceEdits) {
            // this MA is edited - UPDATE CASE

            if (typeof currencyPriceEdits[price.currency_code] === "number") {
              const p = { ...price }
              const num =
                currencyPriceEdits[price.currency_code] *
                Math.pow(
                  10,
                  CURRENCY_MAP[price.currency_code.toUpperCase()].decimal_digits
                )

              p.amount = parseFloat(num.toFixed(0))

              pricesPayload.push(p)
            } else {
              // amount is unset -> DELETED case just skip
            }
          } else {
            pricesPayload.push(price) // not edited just send it so it's not deleted
          }

          delete currencyPriceEdits[price.currency_code] // not deleted entries are new prices
        }
      })

      Object.entries(currencyPriceEdits).forEach(([currency, amount]) => {
        if (typeof amount === "number") {
          const num =
            amount *
            Math.pow(10, CURRENCY_MAP[currency.toUpperCase()].decimal_digits)

          amount = parseFloat(num.toFixed(0))

          pricesPayload.push({ currency_code: currency, amount })
        }
      })

      Object.entries(regionPriceEdits).forEach(([region, amount]) => {
        if (typeof amount === "number") {
          const currency = regionCurrenciesMap[region]

          const num =
            amount *
            Math.pow(10, CURRENCY_MAP[currency.toUpperCase()].decimal_digits)

          amount = parseFloat(num.toFixed(0))

          pricesPayload.push({ region_id: region, amount })
        }
      })

      // @ts-ignore
      return updateVariant.mutateAsync({
        variant_id: variant.id,
        prices: pricesPayload.map((p) =>
          pick(p, ["id", "amount", "region_id", "currency_code"])
        ),
      })
    })

    Promise.all(promises)
      .then(() => {
        notification(
          "Success",
          "Successfully updated variant prices",
          "success"
        )
        props.close()
      })
      .catch((e) => {
        notification("Error", "Failed to update variant prices", "error")
      })
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCloseConfirmationPrompt(true)
      }
    }
    document.addEventListener("keydown", onEsc)
    return () => document.removeEventListener("keydown", onEsc)
  }, [])

  return (
    <Fade isFullScreen isVisible>
      <Modal.Body className="border bg-gray-200 p-2">
        <div className="h-full overflow-hidden rounded-lg border border-gray-300 bg-white">
          <div className="flex h-[64px] items-center justify-between px-4">
            <div className="flex h-[20px] items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowCloseConfirmationPrompt(true)}
                className="text-grey-50 cursor-pointer"
              >
                <CrossIcon size={20} />
              </Button>
              <span className="text-small rounded-lg border border-2 border-gray-300 bg-gray-100 px-2 font-medium text-gray-500">
                esc
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="small"
                onClick={props.close}
                className="text-black-800  cursor-pointer border p-1.5 font-medium"
              >
                Discard
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={onSave}
                className="cursor-pointer border bg-black p-1.5 font-medium text-white hover:bg-black"
              >
                Save and close
              </Button>
            </div>
          </div>
          <EditPricesActions
            selectedCurrencies={selectedCurrencies.sort()}
            selectedRegions={selectedRegions.sort()}
            toggleCurrency={toggleCurrency}
            toggleRegion={toggleRegion}
          />
          <EditPricesTable
            product={props.product}
            currencies={selectedCurrencies.sort()}
            regions={selectedRegions.sort()}
            onPriceUpdate={onPriceUpdate}
          />
        </div>
      </Modal.Body>
      {showCloseConfirmationPrompt && (
        <DeletePrompt
          handleClose={() => setShowCloseConfirmationPrompt(false)}
          onDelete={async () => props.close()}
          successText={""}
          confirmText="Yes, close"
          heading="Close"
          text="Are you sure you want to close this editor without saving?"
        />
      )}
      {showSaveConfirmationPrompt && (
        <SavePrompt
          onSaveAll={async () => save()}
          onSaveOnlyVisible={async () => save(true)}
          hiddenEditedColumns={detectHiddenEditedColumns()}
          handleClose={() => setShowSaveConfirmationPrompt(false)}
        />
      )}
    </Fade>
  )
}

export default EditPricesModal
