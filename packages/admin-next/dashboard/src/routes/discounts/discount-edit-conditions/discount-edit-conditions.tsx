import { useAdminDiscount } from "medusa-react"
import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal/index.ts"
import { expand } from "../discount-detail/loader.ts"
import { EditDiscountConditionsForm } from "./components/edit-discount-form/index.ts"

export const DiscountEditConditions = () => {
  const { id } = useParams()

  const { discount, isLoading, isError, error } = useAdminDiscount(id!, {
    expand,
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && discount && (
        <EditDiscountConditionsForm discount={discount} />
      )}
    </RouteFocusModal>
  )
}
