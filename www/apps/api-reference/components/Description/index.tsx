"use server"

import type { OpenAPIV3 } from "openapi-types"
import Section from "../Section"
import MDXContentServer from "../MDXContent/Server"

export type DescriptionProps = {
  specs: OpenAPIV3.Document
}

const Description = ({ specs }: DescriptionProps) => {
  return (
    <Section>
      <MDXContentServer
        content={specs.info.description}
        scope={{
          specs,
        }}
      />
    </Section>
  )
}

export default Description
