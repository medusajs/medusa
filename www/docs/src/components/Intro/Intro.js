import React from "react";
import Link from "@docusaurus/Link";
import styles from "./intro.module.css";

const Intro = ({ title, desc }) => {
  return (
    <div>
      <h1 className="margin-bottom--xs margin-top--lg">Documentation</h1>
      <p className={styles.title}>{title}</p>
      <h2 className="margin-top--lg margin-bottom--sm">Quickstart</h2>
      <p className={styles.description}>{desc}</p>
      <Link
        to="https://github.com/medusajs/medusa#-quickstart"
        className="margin-top--md margin-bottom--xl button button--lg button--primary"
      >
        Get started now
      </Link>
    </div>
  );
};

export default Intro;
