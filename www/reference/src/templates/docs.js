import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import navList from "../../../../docs/content/nav.yml"
import { MarkdownPage } from "../components/MarkdownPage"

export default function DocsTemplate({ data }) {
  return (
    <Layout>
      <MarkdownPage navList={navList} markdownRemark={data.markdownRemark} />
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
      headings {
        id
        value
        depth
      }
    }
  }
`
