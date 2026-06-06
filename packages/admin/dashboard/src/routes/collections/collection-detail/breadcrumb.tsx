import { HttpTypes } from "@zjedene-medusa/types"
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
