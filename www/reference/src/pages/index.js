import React from "react"
import { Helmet } from "react-helmet"
import { Flex, Box } from "theme-ui"

import Layout from "../components/layout"
import { graphql } from "gatsby"
import Section from "../components/section"
import ReferenceItem from "../components/ReferenceItem"

export default function Home({ data }) {
  const { apiNode } = data
  const {
    apiNode: { sections },
  } = data

  const Sections = apiNode.sections.map(({ section }) => (
    <Section
      id={section.section_name}
      key={section.section_name}
      name={section.section_name}
    />
  ))

  const ReferenceItems = sections.map(({ section }) => (
    <ReferenceItem data={section} />
  ))
  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <main>
        <Flex>
          <Box>{Sections}</Box>
          <Box>{ReferenceItems}</Box>
        </Flex>
      </main>
    </Layout>
  )
}

export const data = graphql`
  query MyQuery {
    apiNode {
      sections {
        section {
          ...section
        }
      }
    }
  }
`
