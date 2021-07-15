import React from "react";
import { Banner } from "../components/Banner/";
import { Intro } from "../components/Intro/";
import { Layout } from "../components/Layout/";
import { TabsPanel } from "../components/Tabs";
import styles from "./index.module.css";

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
];

export default function Home() {
  return (
    <Layout title={`Docs`} description="some description...">
      <div className={styles.container}>
        <Banner />
        <Intro
          title="Explore and learn how to use Medusa."
          desc="Get up and running within 5 minutes, with helpful starters that lay the foundation for growth."
        />
        <TabsPanel items={CARDS_DATA} />
      </div>
    </Layout>
  );
}
