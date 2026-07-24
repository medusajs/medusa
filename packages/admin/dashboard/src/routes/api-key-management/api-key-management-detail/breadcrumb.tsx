import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useApiKey } from "../../../hooks/api"

type ApiKeyManagementDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminApiKeyResponse>

export const ApiKeyManagementDetailBreadcrumb = (
  props: ApiKeyManagementDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { api_key } = useApiKey(id!, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!api_key) {
    return null
  }

  return <span>{api_key.title}</span>
}

export const seo = (match: UIMatch<HttpTypes.AdminApiKeyResponse>) => ({
  title: match.data?.api_key?.title,
})
