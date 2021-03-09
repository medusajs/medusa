import React, { useState, useEffect } from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import adminSpec from "../../../docs/api/admin-spec3.json"
import spec from "../../../docs/api/admin-spec3.json"

import Layout from "../components/layout"
import SideBar from "../components/sidebar"
import DocsReader from "../components/docs-reader"

export default function Home() {
  const tags = {}

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, specification] of Object.entries(methods)) {
      for (const t of specification.tags) {
        if (t in tags) {
          tags[t].push({
            method: method.toUpperCase(),
            path,
            ...specification,
          })
        } else {
          tags[t] = [
            {
              method: method.toUpperCase(),
              path,
              ...specification,
            },
          ]
        }
      }
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex>
        <SideBar tags={tags} />
        <DocsReader tags={tags} />
      </Flex>
    </Layout>
  )
}
