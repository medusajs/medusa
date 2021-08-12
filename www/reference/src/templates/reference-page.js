import React, { useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import Content from "../components/content"
import NavigationContext from "../context/navigation-context"

export default function ReferencePage({
  pageContext: { data, api, title, description, to },
}) {
  const { setApi, goTo, metaData } = useContext(NavigationContext)
  const [metadata, setMetadata] = useState({
    title: title,
    description: description,
  })

  useEffect(() => {
    setApi(api)
    if (to) {
      console.log(to)
      goTo(to)
    }
  }, [])

  useEffect(() => {
    if (metaData) {
      setMetadata({
        title: metaData.title,
        description: metaData.description,
      })
    }
  }, [metaData])

  return (
    <Layout data={data} api={api}>
      <Helmet>
        <title>{`${metadata.title} | Medusa Commerce API Reference`}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>
      <Content data={data} />
    </Layout>
  )
}
