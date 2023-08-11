import dynamic from "next/dynamic"
import type { OpenAPIV3 } from "openapi-types"
import type { SecurityDescriptionProps } from "./Description"
import { Fragment } from "react"

const SecurityDescription = dynamic<SecurityDescriptionProps>(
  async () => import("./Description")
) as React.FC<SecurityDescriptionProps>

type SecurityProps = {
  specs?: OpenAPIV3.Document
}

const Security = ({ specs }: SecurityProps) => {
  return (
    <div>
      {specs && (
        <>
          {Object.values(specs.components?.securitySchemes || {}).map(
            (securitySchema, index) => (
              <Fragment key={index}>
                {!("$ref" in securitySchema) && (
                  <SecurityDescription securitySchema={securitySchema} />
                )}
              </Fragment>
            )
          )}
        </>
      )}
    </div>
  )
}

export default Security
