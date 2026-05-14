"use server"

import React from "react"
import type { OpenAPI } from "types"
import Section from "../Section"
import MDXContentServer from "../MDXContent/Server"

export type DescriptionProps = {
  specs: OpenAPI.OpenAPIV3.Document
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
