import React from "react"
import { useBaseSpecs } from "@/providers/base-specs"
import type { OpenAPI } from "types"
import { Card } from "docs-ui"
import { useMemo } from "react"

export type TagsOperationDescriptionSectionSecurityProps = {
  security: OpenAPI.OpenAPIV3.SecurityRequirementObject[]
}

const TagsOperationDescriptionSectionSecurity = ({
  security,
}: TagsOperationDescriptionSectionSecurityProps) => {
  const { getSecuritySchema } = useBaseSpecs()

  const linkToAuth = useMemo(() => {
    const hasNoAuth = security.some((item) => {
      const schema = getSecuritySchema(Object.keys(item)[0])
      return schema && schema["x-is-auth"] === false
    })

    return !hasNoAuth
  }, [security, getSecuritySchema])

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
      <Card
        title="Authorization"
        text={getDescription()}
        href={linkToAuth ? "#authentication" : undefined}
      />
    </div>
  )
}

export default TagsOperationDescriptionSectionSecurity
