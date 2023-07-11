import type { DescriptionProps } from "@/components/Description"
import type { TagsProps } from "@/components/Tags"
import getBaseUrl from "@/utils/get-base-url"
import dynamic from "next/dynamic"
import { OpenAPIV3 } from "openapi-types"
import Loading from "./loading"

const Description = dynamic<DescriptionProps>(
  async () => import("@/components/Description"),
  {
    loading: () => <Loading />,
  }
) as React.FC<DescriptionProps>
const Tags = dynamic<TagsProps>(async () => import("@/components/Tags"), {
  loading: () => <Loading />,
}) as React.FC<TagsProps>

const getBaseSpecs = async () => {
  const res = await fetch(`${getBaseUrl()}/api/base-specs`)
  return res.json() as unknown as OpenAPIV3.Document
}

const ReferencePage = async () => {
  const specs = await getBaseSpecs()

  return (
    <div>
      <h1>{specs.info.title}</h1>
      {specs.info.description && <Description specs={specs} />}
      {specs.tags && <Tags tags={specs.tags} baseSpecs={specs} />}
    </div>
  )
}

export default ReferencePage
