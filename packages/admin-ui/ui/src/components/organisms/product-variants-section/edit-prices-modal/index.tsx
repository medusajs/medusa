import React, { useEffect, useState } from "react"
import { Product } from "@medusajs/client-types"

import Modal from "../../../molecules/modal"
import Fade from "../../../atoms/fade-wrapper"
import Button from "../../../fundamentals/button"
import { getAllProductPricesCurrencies } from "./utils"
import CrossIcon from "../../../fundamentals/icons/cross-icon"
import EditPricesTable from "./edit-prices-table"
import EditPricesActions from "./edit-prices-actions"

type EditPricesModalProps = {
  close: () => void
  product: Product
}

/**
 * Edit prices modal container.
 */
function EditPricesModal(props: EditPricesModalProps) {
  const currencies = getAllProductPricesCurrencies(props.product).sort()

  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

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

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.close()
      }
    }
    document.addEventListener("keydown", onEsc)

    return () => document.removeEventListener("keydown", onEsc)
  }, [])

  return (
    <Fade isFullScreen isVisible>
      <Modal.Body className="border bg-gray-200 p-2">
        <div className="h-full rounded-lg border border-gray-300 bg-white">
          <div className="flex h-[64px] items-center justify-between px-4">
            <div className="flex h-[20px] items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={props.close}
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
                onClick={props.close}
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
          />
        </div>
      </Modal.Body>
    </Fade>
  )
}

export default EditPricesModal
