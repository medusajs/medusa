import React from "react"
import Link from "@docusaurus/Link"
import CodeBlock from "@theme/CodeBlock"
import styles from "./intro.module.css"

const Intro = ({ title, desc }) => {
  return (
    <div>
      <h1 className="margin-bottom--xs margin-top--lg">Documentation</h1>
      <p className={styles.title}>{title}</p>
      <h2 className="margin-top--lg margin-bottom--sm">Quickstart</h2>
      <p className={styles.description}>{desc}</p>
      <CodeBlock>
        {`yarn global add @medusajs/medusa-cli
medusa new my-awesome-store`}
      </CodeBlock>
      <div>
        <Link
          to="quickstart/quick-start"
          className="margin-top--md margin-bottom--sm button button--lg button--primary"
        >
          Quickstart Guide →
        </Link>
      </div>
      <div className={` margin-top--md`}>
        <Link
          to="tutorial/set-up-your-development-environment"
          className={`${styles.docsLink}`}
        >
          Set up your own local environment →
        </Link>
      </div>
      <div className={`margin-top--md`}>
        <Link
          to="tutorial/creating-your-medusa-server"
          className={`${styles.docsLink}`}
        >
          Create your very own Medusa server →
        </Link>
      </div>
      <div className={`margin-top--md margin-bottom--xl`}>
        <Link to="how-to/plugins" className={`${styles.docsLink}`}>
          Explore plugins →
        </Link>
      </div>
    </div>
  )
}

export default Intro
