import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import Layout from "../../components/layout"
import SideBar from "../../components/sidebar"
import DocsReader from "../../components/docs-reader"

import AdminApi from "../../../data/admin-api.json"

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Admin API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar tags={AdminApi.tags} />
        <DocsReader tags={AdminApi.tags} spec={AdminApi.spec} />
      </Flex>
    </Layout>
  )
}
