import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { usePromotion } from "../../../hooks/api"

type PromotionDetailBreadcrumbProps = UIMatch<HttpTypes.AdminPromotionResponse>

export const PromotionDetailBreadcrumb = (
  props: PromotionDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { promotion } = usePromotion(id!, {
    initialData: props.loaderData,
    enabled: Boolean(id),
  })

  if (!promotion) {
    return null
  }

  return <span>{promotion.code}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminPromotionResponse>) => ({
  title: match.loaderData?.promotion?.code,
})
