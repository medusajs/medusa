import { Checkbox, Text, clx } from "@zjedene-medusa/ui"

import { HttpTypes } from "@zjedene-medusa/types"

type LocationItemProps = {
  selected: boolean
  onSelect: (selected: boolean) => void
  location: HttpTypes.AdminStockLocation
}

export const LocationItem = ({
  selected,
  onSelect,
  location,
}: LocationItemProps) => {
  return (
    <div
      className={clx(
        "flex w-full cursor-pointer gap-x-2 rounded-lg border px-2 py-2",
        {
          "border-ui-border-interactive ": selected,
        }
      )}
      onClick={() => onSelect(!selected)}
    >
      <div className="h-5 w-5">
        <Checkbox
          onClick={(e) => {
            e.stopPropagation()
            onSelect(!selected)
          }}
          checked={selected}
        />
      </div>
      <div className="flex w-full flex-col">
        <Text size="small" leading="compact" weight="plus">
          {location.name}
        </Text>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {[
            location.address?.address_1,
            location.address?.city,
            location.address?.country_code,
          ]
            .filter((el) => !!el)
            .join(", ")}
        </Text>
      </div>
    </div>
  )
}
