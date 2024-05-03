import React from "react"
import { useAdminVariants } from "medusa-react"

const Variants = () => {
  const { variants, isLoading } = useAdminVariants()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {variants && !variants.length && (
        <span>No Variants</span>
      )}
      {variants && variants.length > 0 && (
        <ul>
          {variants.map((variant) => (
            <li key={variant.id}>{variant.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Variants
