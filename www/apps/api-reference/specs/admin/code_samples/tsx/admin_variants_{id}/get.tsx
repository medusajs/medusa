import React from "react"
import { useAdminVariant } from "medusa-react"

type Props = {
  variantId: string
}

const Variant = ({ variantId }: Props) => {
  const { variant, isLoading } = useAdminVariant(
    variantId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {variant && <span>{variant.title}</span>}
    </div>
  )
}

export default Variant
