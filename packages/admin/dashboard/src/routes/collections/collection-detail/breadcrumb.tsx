import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useCollection } from "../../../hooks/api"

type CollectionDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminCollectionResponse>

export const CollectionDetailBreadcrumb = (
  props: CollectionDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { collection } = useCollection(id!, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!collection) {
    return null
  }

  return <span>{collection.title}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminCollectionResponse>) => ({
  title: match.data?.collection?.title,
})
