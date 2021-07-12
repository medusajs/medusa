import React from "react"
import { Box, Flex } from "rebass"
import { Footer } from "../Footer"
import { Sidebar, Toc } from "../Sidebar"
import { Link } from "gatsby"

const MarkdownPage = ({ markdownRemark, navList, previous, next }) => {
  const nextArticle = next && (
    <Link to={next.fields.slug} rel="next">
      {next.frontmatter.title} →
    </Link>
  )
  const prevArticle = previous && (
    <Link to={previous.fields.slug} rel="prev">
      ← {previous.frontmatter.title}
    </Link>
  )

  return (
    <Flex>
      <Box flex="0 0 270px" px={2}>
        <Sidebar items={navList} />
      </Box>
      <Box px={1}>
        <Flex>
          <Flex px={80} flex="0 1 1100px" flexDirection="column">
            <h1 style={{ fontSize: "3em" }}>
              {markdownRemark.frontmatter.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
            <Flex pt={4}>
              <Box pr={2}>Was this helpful?</Box>
              <Box pr={1}>Yes</Box>
              <Box>No</Box>
            </Flex>
            <Box pt={3}>
              <hr />
            </Box>
            <nav>
              <ul>
                <li>{nextArticle}</li>
                <li>{prevArticle}</li>
              </ul>
            </nav>
            <Box pt={3}>
              <hr />
            </Box>
            <Footer />
          </Flex>
          <Box flex="1 1 auto">
            <Toc headings={markdownRemark.headings} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default MarkdownPage
