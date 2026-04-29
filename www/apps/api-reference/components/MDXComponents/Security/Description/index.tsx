import React from "react"
import type { MDXContentClientProps } from "@/components/MDXContent/Client"
import type { MDXContentServerProps } from "@/components/MDXContent/Server"
import type { OpenAPI } from "types"
import getSecuritySchemaTypeName from "@/utils/get-security-schema-type-name"
import clsx from "clsx"
import { Loading } from "docs-ui"
import dynamic from "next/dynamic"

const MDXContentClient = dynamic<MDXContentClientProps>(
  async () => import("@/components/MDXContent/Client"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentClientProps>

const MDXContentServer = dynamic<MDXContentServerProps>(
  async () => import("@/components/MDXContent/Server"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentServerProps>

export type SecurityDescriptionProps = {
  securitySchema: OpenAPI.SecuritySchemeObject
  isServer?: boolean
}

const SecurityDescription = ({
  securitySchema,
  isServer = true,
}: SecurityDescriptionProps) => {
  return (
    <>
      <h2 data-testid="title">{securitySchema["x-displayName"] as string}</h2>
      {isServer && <MDXContentServer content={securitySchema.description} />}
      {!isServer && <MDXContentClient content={securitySchema.description} />}
      <p data-testid="security-scheme-type">
        <strong>Security Scheme Type:</strong>{" "}
        {getSecuritySchemaTypeName(securitySchema)}
      </p>
      {(securitySchema.type === "http" || securitySchema.type === "apiKey") && (
        <p
          className={clsx("bg-medusa-bg-subtle", "p-1")}
          data-testid="security-scheme-type-details"
        >
          <strong>
            {securitySchema.type === "http"
              ? "HTTP Authorization Scheme"
              : "Cookie parameter name"}
            :
          </strong>{" "}
          <code data-testid="security-scheme-type-details-value">
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
