import Description from "@/components/Description"
import Tags from "@/components/Tag"
import getBaseUrl from "@/utils/get-hostname"
import { OpenAPIV3 } from "openapi-types"

const getBaseSpecs = async () => {
  const res = await fetch(`${getBaseUrl()}/api/base-specs`)
  return res.json() as unknown as OpenAPIV3.Document
}

const Reference = async () => {
  const specs = await getBaseSpecs()

  return (
    <div>
      <h1>{specs.info.title}</h1>
      {specs.info.description && <Description specs={specs} />}
      {specs.tags && <Tags tags={specs.tags} />}
    </div>
  )
}

export default Reference
