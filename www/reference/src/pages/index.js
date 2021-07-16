import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import SideBar from "../components/sidebar"
import DocsReader from "../components/docs-reader"

import AdminApi from "../../data/admin-api.json"
import { graphql } from "gatsby"
import Section from "../components/section"

export default function Home({ data }) {
  console.log("api node: ", data)
  const { store } = data

  const Sections = store.sections.map(({ section }) => (
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
      <main>{Sections}</main>
    </Layout>
  )
}

export const data = graphql`
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
