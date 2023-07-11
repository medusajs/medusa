import { OpenAPIV3 } from "openapi-types"
import SecurityDescription from "./Description"

type SecurityProps = {
  specs?: OpenAPIV3.Document
}

const Security = ({ specs }: SecurityProps) => {
  return (
    <div>
      {specs && (
        <>
          {Object.values(specs.components?.securitySchemes || {}).map(
            (securitySchema) => (
              <>
                {!("$ref" in securitySchema) && (
                  <SecurityDescription securitySchema={securitySchema} />
                )}
              </>
            )
          )}
        </>
      )}
    </div>
  )
}

export default Security
