import React from "react";
import { Banner } from "../components/Banner/";
import { Intro } from "../components/Intro/";
import { Layout } from "../components/Layout/";
import { TabsPanel } from "../components/Tabs";
import styles from "./index.module.css";
import useGlobalData from "@docusaurus/useGlobalData";

const CARDS_DATA = [
  { type: "guide", title: "guide mock item", key: "guides" },
  { type: "tutorial", title: "tutorial mock item", key: "tutorials" },
  { type: "guide", title: "second guide mock item", key: "guides" },
  { type: "reference", title: "reference mock item", key: "reference" },
];

export default function Home() {
  const data = useGlobalData();

  const content = data["docusaurus-plugin-content-docs"][
    "default"
  ].versions.find((v) => v.isLast);

  return (
    <Layout title={`Docs`} description="some description...">
      <div className={styles.container}>
        <Banner />
        <Intro
          title="Explore and learn how to use Medusa."
          desc="Get up and running within 5 minutes."
        />
        <TabsPanel items={CARDS_DATA} />
      </div>
    </Layout>
  );
}
