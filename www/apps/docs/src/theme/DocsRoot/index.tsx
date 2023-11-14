import React from "react"
import clsx from "clsx"
import {
  ThemeClassNames,
  HtmlClassNameProvider,
} from "@docusaurus/theme-common"
import renderRoutes from "@docusaurus/renderRoutes"
import Layout from "@theme/Layout"

import type { Props } from "@theme/DocVersionRoot"
import DocsProviders from "../../providers/DocsProviders"

export default function DocsRoot(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages)}>
      <DocsProviders>
        <Layout>{renderRoutes(props.route.routes!)}</Layout>
      </DocsProviders>
    </HtmlClassNameProvider>
  )
}
