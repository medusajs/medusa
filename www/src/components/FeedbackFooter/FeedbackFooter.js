import React from "react"
import { Box, Flex } from "rebass"

const FeedbackFooter = () => {
  return (
    <Flex>
      <Box pr={2}>Was this helpful?</Box>
      <Box pr={1}>Yes</Box>
      <Box>No</Box>
    </Flex>
  )
}

export default FeedbackFooter
