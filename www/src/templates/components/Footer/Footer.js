import React from "react"
import { Box, Flex } from "rebass"

const Footer = () => {
  return (
    <Box py={3}>
      <Flex>
        <Box pr={3}>© Medusa Commerce</Box>
        <Box pr={3}>Contact</Box>
        <Box pr={3}>Privacy & Terms</Box>
      </Flex>
    </Box>
  )
}

export default Footer
