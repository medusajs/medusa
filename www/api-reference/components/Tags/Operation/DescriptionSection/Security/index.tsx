import { useBaseSpecs } from "@/providers/base-specs"
import type { OpenAPIV3 } from "openapi-types"
import DetailsSummary from "../../../../Details/Summary"

export type TagsOperationDescriptionSectionSecurityProps = {
  security: OpenAPIV3.SecurityRequirementObject[]
}

const TagsOperationDescriptionSectionSecurity = ({
  security,
}: TagsOperationDescriptionSectionSecurityProps) => {
  const { getSecuritySchema } = useBaseSpecs()

  const getDescription = () => {
    let str = ""
    security.forEach((item) => {
      if (str.length) {
        str += " or "
      }
      str += getSecuritySchema(Object.keys(item)[0])?.["x-displayName"]
    })
    return str
  }

  return (
    <div className="my-2">
      <DetailsSummary
        title="Authorizations"
        subtitle={getDescription()}
        expandable={false}
      />
    </div>
  )
}

export default TagsOperationDescriptionSectionSecurity
