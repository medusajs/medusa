import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import SideBar from "../components/sidebar"
import DocsReader from "../components/docs-reader"

import AdminApi from "../../data/admin-api.json"
import { graphql } from "gatsby"

export default function Home({ data }) {
  console.log("data: ", data)
  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
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
