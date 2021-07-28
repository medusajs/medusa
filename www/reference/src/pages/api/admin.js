import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import Layout from "../../components/new/components/layout"
import SideBar from "../../components/sidebar"
import DocsReader from "../../components/docs-reader"

import AdminApi from "../../../data/admin-api.json"
import Content from "../../components/new/components/content"

export default function Admin({ data }) {
  return (
    <Layout data={data.admin} api={"admin"}>
      <Helmet>
        <title>Admin API Docs | Medusa Commerce</title>
      </Helmet>
      <Content data={data.admin} />
    </Layout>
  )
}

export const data = graphql`
  query AdminQuery {
    admin {
      sections {
        section {
          ...AdminSection
        }
      }
    }
  }
`
