import React, { useContext, useEffect } from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import Content from "../components/content"
import NavigationContext from "../context/navigation-context"

export default function ReferencePage({
  pageContext: { data, api, title, description, to },
}) {
  const { setApi, goTo } = useContext(NavigationContext)

  useEffect(() => {
    setApi(api)
    if (to) {
      goTo(to)
    }
  }, [])
  return (
    <Layout data={data} api={api}>
      <Helmet>
        <title>{`${title} | Medusa Commerce API Reference`}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Content data={data} />
    </Layout>
  )
}
