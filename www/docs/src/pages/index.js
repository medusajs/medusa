import React from "react"
import { Banner } from "../components/Banner/"
import { Intro } from "../components/Intro/"
import { Layout } from "../components/Layout/"
import styles from "./index.module.css"

export default function Home() {
  return (
    <Layout title={`Docs`} description="some description...">
      <div className={styles.container}>
        <Banner />
        <Intro
          title="Explore and learn how to use Medusa."
          desc="Get up and running within 5 minutes."
        />
        {/* <TabsPanel items={CARDS_DATA} /> */}
      </div>
    </Layout>
  )
}
