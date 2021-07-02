import React from "react"
import { Flex } from "rebass"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import Banner from "../components/cta-banner"
import Intro from "../components/intro-section"
import TabsPanel from "../components/tabs/tabs-panel"

const CARDS_DATA = [
  { type: "guide", title: "guide mock item" },
  { type: "tutorial", title: "tutorial mock item" },
  { type: "reference", title: "reference mock item" },
]

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>API Docs | Medusa Commerce</title>
      </Helmet>
      <Flex flexDirection="column" sx={{ minWidth: "867px;" }}>
        <Banner />
        <Intro
          title="Explore and learn how to use Medusa."
          desc="Get up and running within 5 minutes, with helpful starters that lay the foundation for growth."
        />
        <TabsPanel items={CARDS_DATA} />
      </Flex>
    </Layout>
  )
}
