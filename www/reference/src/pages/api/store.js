import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import Layout from "../../components/new/components/layout"
import SideBar from "../../components/sidebar"
import DocsReader from "../../components/docs-reader"

import storefrontApi from "../../../data/admin-api.json"
import Content from "../../components/new/components/content"

export default function Store({ data }) {
  return (
    <Layout data={data.store} api={"store"}>
      <Helmet>
        <title>Storefront API Docs | Medusa Commerce</title>
      </Helmet>
      <Content data={data.store} />
    </Layout>
  )
}

export const data = graphql`
  query StoreQuery {
    store {
      sections {
        section {
          ...StoreSection
        }
      }
    }
  }
`
