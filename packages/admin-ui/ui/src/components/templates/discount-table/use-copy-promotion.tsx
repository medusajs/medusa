import { useAdminCreateDiscount } from "medusa-react"
import { useNavigate } from "react-router-dom"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { removeNullish } from "../../../utils/remove-nullish"

const useCopyPromotion = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const createPromotion = useAdminCreateDiscount()

  const handleCopyPromotion = async (promotion) => {
    const copy: any = {
      code: `${promotion.code}_COPY`,
      is_disabled: promotion.is_disabled,
      is_dynamic: promotion.is_dynamic,
      starts_at: promotion.starts_at,
      regions: promotion.regions.map((region) => region.id),
    }

    if (promotion.ends_at) {
      copy.ends_at = promotion.ends_at
    }

    if (promotion.valid_duration) {
      copy.valid_duration = promotion.valid_duration
    }

    if (typeof promotion.usage_limit === "number") {
      copy.usage_limit = promotion.usage_limit
    }

    if (promotion.metadata) {
      copy.metadata = promotion.metadata
    }

    copy.rule = {
      type: promotion.rule.type,
      value: promotion.rule.value,
      description: promotion.rule.description,
    }

    if (promotion.rule.allocation) {
      copy.rule.allocation = promotion.rule.allocation
    }

    if (promotion.rule.conditions) {
      copy.rule.conditions = promotion.rule.conditions.map((cond) => ({
        operator: cond.operator,
        ...removeNullish({
          products: cond.products,
          product_types: cond.product_types,
          product_tags: cond.product_tags,
          product_collections: cond.product_collections,
          customer_groups: cond.customer_groups,
        }),
      }))
    }

    await createPromotion.mutate(copy, {
      onSuccess: (result) => {
        navigate(`/a/discounts/${result.discount.id}`)
        notification("Success", "Successfully copied discount", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  return handleCopyPromotion
}

export default useCopyPromotion
