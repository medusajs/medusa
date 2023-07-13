import { useBaseSpecs } from "@/providers/base-specs"
import type { OpenAPIV3 } from "openapi-types"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic"
import type { SecurityDescriptionProps } from "../../../../MDXComponents/Security/Description"
import { Suspense } from "react"
import Details from "@/components/Details"

const SecurityDescription = dynamic<SecurityDescriptionProps>(
  async () => import("../../../../MDXComponents/Security/Description"),
  {
    loading: () => <Loading />,
  }
) as React.FC<SecurityDescriptionProps>

export type TagsOperationDescriptionSectionSecurityProps = {
  security: OpenAPIV3.SecurityRequirementObject[]
}

const TagsOperationDescriptionSectionSecurity = ({
  security,
}: TagsOperationDescriptionSectionSecurityProps) => {
  const { getSecuritySchema } = useBaseSpecs()

  return (
    <Suspense fallback={<Loading />}>
      <Details
        className="my-1"
        summaryContent={
          <div className="inline-flex w-11/12">
            <span className="w-1/3">
              <b>Authorizations</b>
            </span>
            <span className="w-2/3">
              {security.map((security, index) => (
                <div key={index}>
                  {index !== 0 && " or "}
                  {
                    getSecuritySchema(Object.keys(security)[0])?.[
                      "x-displayName"
                    ]
                  }
                </div>
              ))}
            </span>
          </div>
        }
      >
        <div className="bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark p-1">
          {security.map((security, index) => {
            const securitySchema = getSecuritySchema(Object.keys(security)[0])
            if (!securitySchema) {
              return <></>
            }
            return (
              <SecurityDescription
                securitySchema={securitySchema}
                isServer={false}
                key={index}
              />
            )
          })}
        </div>
      </Details>
    </Suspense>
  )
}

export default TagsOperationDescriptionSectionSecurity
