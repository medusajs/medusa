import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SideBar from "../components/sidebar"
import DocsReader from "../components/docs-reader"

import Storefront from "../../data/storefront-api.json"

export default function Home({ data }) {
  console.log(data)
  console.log(Storefront.tags)
  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar tags={Storefront.tags} />
        <DocsReader tags={Storefront.tags} spec={Storefront.spec} />
      </Flex>
    </Layout>
  )
}

export const query = graphql`
  query MyQuery {
    allFile(
      filter: {
        name: { eq: "store-spec3" }
        internal: { mediaType: { eq: "application/json" } }
      }
    ) {
      nodes {
        name
        sourceInstanceName
        internal {
          type
          mediaType
        }
        childApiJson {
          tags {
            name
          }
        }
      }
    }
  }
`
