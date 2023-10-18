import type { MDXContentClientProps } from "@/components/MDXContent/Client"
import type { MDXContentServerProps } from "@/components/MDXContent/Server"
import type { SecuritySchemeObject } from "@/types/openapi"
import getSecuritySchemaTypeName from "@/utils/get-security-schema-type-name"
import clsx from "clsx"
import { Loading } from "docs-ui"
import dynamic from "next/dynamic"

const MDXContentClient = dynamic<MDXContentClientProps>(
  async () => import("../../../MDXContent/Client"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentClientProps>

const MDXContentServer = dynamic<MDXContentServerProps>(
  async () => import("../../../MDXContent/Server"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentServerProps>

export type SecurityDescriptionProps = {
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
        <p className={clsx("bg-docs-bg-surface", "p-1")}>
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
