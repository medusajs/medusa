"use server"

import { OpenAPIV3 } from "openapi-types"
import Section from "../Section"
import MDXContentServer from "../MDXContent/Server"

type DescriptionProps = {
  specs: OpenAPIV3.Document
}

const Description = ({ specs }: DescriptionProps) => {
  return (
    <Section
      content={
        <MDXContentServer
          content={specs.info.description}
          scope={{
            specs,
          }}
        />
      }
    />
  )
}

export default Description
