import React from "react"
import { useAdminVariantsInventory } from "medusa-react"

type Props = {
  variantId: string
}

const VariantInventory = ({ variantId }: Props) => {
  const { variant, isLoading } = useAdminVariantsInventory(
    variantId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {variant && variant.inventory.length === 0 && (
        <span>Variant doesn't have inventory details</span>
      )}
      {variant && variant.inventory.length > 0 && (
        <ul>
          {variant.inventory.map((inventory) => (
            <li key={inventory.id}>{inventory.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default VariantInventory
