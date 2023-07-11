import MDXContentClient from "@/components/MDXContent/Client"
import MDXContentServer from "@/components/MDXContent/Server"
import { SecuritySchemeObject } from "@/types/openapi"
import getSecuritySchemaTypeName from "@/utils/get-security-schema-type-name"
import clsx from "clsx"

type SecurityDescriptionProps = {
  securitySchema: SecuritySchemeObject
  isServer?: boolean
}

const SecurityDescription = ({
  securitySchema,
  isServer = true,
}: SecurityDescriptionProps) => {
  return (
    <>
      <h2>{securitySchema["x-displayName"] as string}</h2>
      {isServer && <MDXContentServer content={securitySchema.description} />}
      {!isServer && <MDXContentClient content={securitySchema.description} />}
      <p>
        <strong>Security Scheme Type:</strong>{" "}
        {getSecuritySchemaTypeName(securitySchema)}
      </p>
      {(securitySchema.type === "http" || securitySchema.type === "apiKey") && (
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

export default SecurityDescription
