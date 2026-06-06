import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"
import { useRegion } from "../../../hooks/api/regions"
import { REGION_DETAIL_FIELDS } from "./constants"

type RegionDetailBreadcrumbProps = UIMatch<HttpTypes.AdminRegionResponse>

export const RegionDetailBreadcrumb = (props: RegionDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { region } = useRegion(
    id!,
    {
      fields: REGION_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!region) {
    return null
  }

  return <span>{region.name}</span>
}
