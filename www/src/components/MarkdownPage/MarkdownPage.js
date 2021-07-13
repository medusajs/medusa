import React from "react"
import { Box, Flex } from "rebass"
import { Footer } from "../Footer/"
import { Sidebar, Toc } from "../Sidebar/"
import { NavigationFooter } from "../NavigationFooter/"
import { FeedbackFooter } from "../FeedbackFooter/"

const MarkdownPage = ({ markdownRemark, navList, previous, next }) => {
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
            <Box pt={3}>
              <FeedbackFooter />
            </Box>
            <Box pt={3}>
              <hr />
            </Box>
            <Box pt={2}>
              <NavigationFooter previous={previous} next={next} />
            </Box>
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
