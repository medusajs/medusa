import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Flex, Box } from "theme-ui"

import Layout from "../components/layout"
import Section from "../components/section"
import ReferenceItem from "../components/ReferenceItem"
import Sidebar from "../components/new/components/sidebar"
import Content from "../components/new/components/content"

export default function Home({ data }) {
  console.log(data.admin)
  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <main>
        <Flex>
          <Sidebar data={data} />
          <Content data={data} />
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
    store {
      sections {
        section {
          ...StoreSection
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
