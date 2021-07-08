import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

import navDocs from "../../../docs/content/nav.yml"

export default function DocsTemplate({ data }) {
  const item = data.markdownRemark

  return (
    <Layout>
      <h1>{item.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: item.html }} />
    </Layout>
  )
}

export const query = graphql`
  query DocsQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
