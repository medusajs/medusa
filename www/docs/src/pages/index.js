import React from "react"
import { Flex } from "rebass"
// import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import Banner from "../components/cta-banner"
import Intro from "../components/intro-section"
import TabsPanel from "../components/tabs/tabs-panel"

const CARDS_DATA = [
  { type: "guide", title: "guide mock item", key: "guides" },
  { type: "tutorial", title: "tutorial mock item", key: "tutorials" },
  { type: "guide", title: "second guide mock item", key: "guides" },
  { type: "reference", title: "reference mock item", key: "reference" },
  {
    type: "contributing",
    title: "contributing mock item",
    key: "contributing",
  },
]

export default function Home() {
  return (
    <Layout>
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
