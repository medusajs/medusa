import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Flex, Box } from "theme-ui"

import Layout from "../components/layout"
import Section from "../components/section"
import ReferenceItem from "../components/ReferenceItem"

export default function Home({ data }) {
  console.log("api node: ", data)
  const { admin, store } = data

  const Sections = admin.sections.map(({ section }) => (
    <Section
      id={section.section_name}
      key={section.section_name}
      name={section.section_name}
    />
  ))

  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <main>
        <Flex>
          <Box>{Sections}</Box>
        </Flex>
      </main>
    </Layout>
  )
}

export const data = graphql`
  query MyQuery {
    admin {
      sections {
        section {
          ...AdminSection
        }
      }
    }
  }
`

/**query store example:
 * export const data = graphql`
  query MyQuery {
    store {
      sections {
        section {
          ...StoreSection
        }
      }
    }
  }
`
 */
