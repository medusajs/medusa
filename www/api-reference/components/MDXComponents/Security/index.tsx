import MDXContentServer from "@/components/MDXContent/Server"
import getSecuritySchemaTypeName from "@/utils/get-security-schema-type-name"
import clsx from "clsx"
import { OpenAPIV3 } from "openapi-types"

type SecurityProps = {
  specs?: OpenAPIV3.Document
}

const Security = ({ specs }: SecurityProps) => {
  return (
    <div>
      {specs && (
        <>
          {Object.values(specs.components?.securitySchemes || {}).map(
            (securitySchema) => {
              if ("$ref" in securitySchema) {
                return <></>
              }

              return (
                <>
                  {"x-displayName" in securitySchema && (
                    <h2>{securitySchema["x-displayName"] as string}</h2>
                  )}
                  <MDXContentServer content={securitySchema.description} />
                  <p>
                    <strong>Security Scheme Type:</strong>{" "}
                    {getSecuritySchemaTypeName(securitySchema)}
                  </p>
                  {(securitySchema.type === "http" ||
                    securitySchema.type === "apiKey") && (
                    <p
                      className={clsx(
                        "bg-docs-bg-surface dark:bg-docs-bg-surface-dark",
                        "p-1"
                      )}
                    >
                      <strong>
                        {securitySchema.type === "http"
                          ? "HTTP Authorization Scheme"
                          : "Cookie parameter name"}
                        :
                      </strong>{" "}
                      <code>
                        {securitySchema.type === "http"
                          ? securitySchema.scheme
                          : securitySchema.name}
                      </code>
                    </p>
                  )}
                  <hr />
                </>
              )
            }
          )}
        </>
      )}
    </div>
  )
}

export default Security
