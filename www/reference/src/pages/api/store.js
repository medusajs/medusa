import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import Layout from "../../components/layout"
import SideBar from "../../components/sidebar"
import DocsReader from "../../components/docs-reader"

import storefrontApi from "../../../data/admin-api.json"

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Storefront API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar tags={storefrontApi.tags} />
        <DocsReader tags={storefrontApi.tags} spec={storefrontApi.spec} />
      </Flex>
    </Layout>
  )
}
