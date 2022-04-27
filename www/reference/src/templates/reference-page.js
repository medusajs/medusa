import React, { useContext, useEffect, useState } from "react"

import Content from "../components/content"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import NavigationContext from "../context/navigation-context"
import { convertToKebabCase } from "../utils/convert-to-kebab-case"

export default function ReferencePage({
  pageContext: { data, api, title, description, to },
}) {
  const { setApi, goTo, metadata, currentSection, currentSectionObj } = useContext(NavigationContext)
  const [siteData, setSiteData] = useState({
    title: title,
    description: description,
  })

  useEffect(() => {
    setApi(api)
    if (to) {
      goTo(to)
    } else if (data.sections && data.sections.length) {
      //go to the first section
      const firstSection = data.sections[0].section;
      goTo({
        section: convertToKebabCase(firstSection.section_name),
        method: firstSection.paths && firstSection.paths.length ? firstSection.paths[0].methods[0].method : '',
        sectionObj: firstSection
      })
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
        <title>{`API | Medusa API Reference`}</title>
        <meta name="description" content={siteData.description} />
      </Helmet>
      <Content data={data} currentSection={currentSectionObj} api={api} />
    </Layout>
  )
}
