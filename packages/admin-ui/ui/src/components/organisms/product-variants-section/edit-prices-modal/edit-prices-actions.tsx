import { useMemo } from "react"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAdminRegions, useAdminStore } from "medusa-react"

import Button from "../../../fundamentals/button"
import AdjustmentsIcon from "../../../fundamentals/icons/adjustments-icon"
import CheckIcon from "../../../fundamentals/icons/check-icon"

type EditPricesActionsProps = {
  selectedCurrencies: string[]
  selectedRegions: string[]
  toggleCurrency: (currencyCode: string) => void
  toggleRegion: (regionId: string) => void
}

/**
 * Edit prices table header actions.
 */
function EditPricesActions(props: EditPricesActionsProps) {
  const { selectedCurrencies, selectedRegions, toggleCurrency, toggleRegion } =
    props

  const { store } = useAdminStore()
  const _currencies = store?.currencies
  const { regions: _regions } = useAdminRegions({
    limit: 1000,
  })

  const currencies = useMemo(() => {
    return (_currencies || []).sort((c1, c2) => c1.code.localeCompare(c2.code))
  }, [_currencies])

  const regions = useMemo(() => {
    return (_regions || []).sort((r1, r2) => r1.name.localeCompare(r2.name))
  }, [_regions])

  return (
    <div
      style={{ fontSize: 13 }}
      className="border-ui-border-base flex items-center gap-2 border-b border-t px-4 py-[12px]"
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" size="small" className="text-gray-700">
            View
            <AdjustmentsIcon size={20} />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown z-30 max-h-[500px] min-w-[272px] overflow-y-scroll border"
        >
          <DropdownMenu.Label className="text-small px-[12px] py-2 font-medium text-gray-400">
            Currencies
          </DropdownMenu.Label>
          {currencies?.map((c) => (
            <DropdownMenu.Item
              key={c.code}
              onClick={(event) => {
                event.preventDefault()
                toggleCurrency(c.code)
              }}
              className="mb-1 cursor-pointer last:mb-0 hover:bg-gray-100"
            >
              <div className="flex justify-between gap-4 px-[12px] py-2 text-gray-800">
                {c.code.toUpperCase()}
                <label className="flex  items-center justify-between gap-2  text-gray-400">
                  <span className="max-w-[180px] truncate">{c.name}</span>
                  {selectedCurrencies.includes(c.code) && (
                    <CheckIcon className="text-gray-900" size={16} />
                  )}
                </label>
              </div>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Label className="text-small border-t border-gray-200 px-[12px] py-2 font-medium text-gray-400">
            Regions
          </DropdownMenu.Label>
          {regions?.map((r) => (
            <DropdownMenu.Item
              onClick={(event) => {
                event.preventDefault()
                toggleRegion(r.id)
              }}
              className="mb-1 cursor-pointer last:mb-0 hover:bg-gray-100"
              key={r.id}
            >
              <div className="flex justify-between gap-4 px-[12px] py-2 text-gray-800">
                {r.name}
                {selectedRegions.includes(r.id) && (
                  <CheckIcon className="text-gray-900" size={16} />
                )}
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default EditPricesActions
