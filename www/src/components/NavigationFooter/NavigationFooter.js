import React from "react"
import { Box, Flex } from "rebass"
import { Link } from "gatsby"

const NavigationFooter = ({ next, previous }) => {
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
    <nav>
      <Flex justifyContent="space-between">
        <Box>{prevArticle}</Box>
        <Box>{nextArticle}</Box>
      </Flex>
    </nav>
  )
}

export default NavigationFooter
