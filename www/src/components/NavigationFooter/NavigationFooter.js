import React from "react"
import { Box, Flex } from "rebass"
import { Link } from "gatsby"

const NavigationFooter = ({ next, prev }) => {
  const nextArticle = next && (
    <Link to={next.slug} rel="next">
      {next.title} →
    </Link>
  )
  const prevArticle = prev && (
    <Link to={prev.slug} rel="prev">
      ← {prev.title}
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
