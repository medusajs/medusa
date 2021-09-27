import React, { useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import Content from "../components/content"
import NavigationContext from "../context/navigation-context"

export default function ReferencePage({
  pageContext: { data, api, title, description, to },
}) {
  const { setApi, goTo, metadata } = useContext(NavigationContext)
  const [siteData, setSiteData] = useState({
    title: title,
    description: description,
  })

  useEffect(() => {
    setApi(api)
    if (to) {
      goTo(to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (metadata) {
      setSiteData({
        title: metadata.title,
        description: metadata.description,
      })
    }
  }, [metadata])

  return (
    <Layout data={data} api={api}>
      <Helmet>
        <title>{`API | Medusa Commerce API Reference`}</title>
        <meta name="description" content={siteData.description} />
      </Helmet>
      <Content data={data} api={api} />
    </Layout>
  )
}
