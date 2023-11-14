import React from "react"
import { translate } from "@docusaurus/Translate"
import { PageMetadata } from "@docusaurus/theme-common"
import Layout from "@theme/Layout"
import NotFoundContent from "@theme/NotFound/Content"
import DocsProviders from "../../providers/DocsProviders"

export default function Index(): JSX.Element {
  const title = translate({
    id: "theme.NotFound.title",
    message: "Page Not Found",
  })
  return (
    <DocsProviders>
      <PageMetadata title={title} />
      <Layout>
        <NotFoundContent />
      </Layout>
    </DocsProviders>
  )
}
