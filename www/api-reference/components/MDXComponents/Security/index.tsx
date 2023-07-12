import dynamic from "next/dynamic"
import type { OpenAPIV3 } from "openapi-types"
import type { SecurityDescriptionProps } from "./Description"
import Loading from "@/components/Loading"

const SecurityDescription = dynamic<SecurityDescriptionProps>(
  async () => import("./Description"),
  {
    loading: () => <Loading />,
  }
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
