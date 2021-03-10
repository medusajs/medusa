import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import rawSpec from "../../../../docs/api/admin-spec3.json"

import Layout from "../../components/layout"
import SideBar from "../../components/sidebar"
import DocsReader from "../../components/docs-reader"

import useSpec from "../../hooks/use-spec"

export default function Home() {
  const { tags, spec } = useSpec(rawSpec)

  return (
    <Layout>
      <Helmet>
        <title>Admin API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar tags={tags} />
        <DocsReader tags={tags} spec={spec} />
      </Flex>
    </Layout>
  )
}
