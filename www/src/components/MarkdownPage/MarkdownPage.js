import { useLocation } from "@reach/router"
import React from "react"
import { Box, Flex } from "theme-ui"
import { FeedbackFooter } from "../FeedbackFooter/"
import { Footer } from "../Footer/"
import { NavigationFooter } from "../NavigationFooter/"
import { Sidebar, Toc } from "../Sidebar/"
import { getRouteContext } from "../../utils/getRouteContext"

const MarkdownPage = ({ markdownRemark, navList }) => {
  const location = useLocation()
  const { prev, next } = getRouteContext(navList, location)

  return (
    <Flex>
      <Box sx={{ flex: "0 0 270px" }} px={2}>
        <Sidebar items={navList} />
      </Box>
      <Box px={1}>
        <Flex>
          <Flex px={80} sx={{ flex: "0 1 1100px", flexDirection: "column" }}>
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
              <NavigationFooter prev={prev} next={next} />
            </Box>
            <Box pt={3}>
              <hr />
            </Box>
            <Footer />
          </Flex>
          <Box sx={{ flex: "1 1 auto" }}>
            <Toc headings={markdownRemark.headings} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default MarkdownPage
