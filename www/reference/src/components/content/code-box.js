import React from "react"
import { Flex, Box, Text, IconButton } from "theme-ui"
import { Image } from "@theme-ui/components"
import Clipboard from '../icons/clipboard'

const CodeBox = ({ header, children, shell }) => {
  return (
    <Box
      sx={{
        background: "fadedContrast",
        borderRadius: "small",
        boxShadow: "0 0 0 1px rgb(0 0 0 / 7%)",
        alignSelf: "flex-start",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        mb: "4",
      }}
    >
      <Box
        sx={{
          bg: "faded",
          p: "8px 10px",
          letterSpacing: "0.01em",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Flex sx={{ height: '100%', justifyContent: 'space-between', alignItems: 'center'}}>

        <Text variant="small" sx={{ fontWeight: "400" }}>
          {header.toUpperCase()}
        </Text>
        {shell ? <Clipboard/> : <></>}
        </Flex>
      </Box>
      <Box
        sx={{
          position: "relative",
          boxSizing: "content-box",
          maxHeight: "calc(90vh - 20px)",
          minHeight: "10px",
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            position: "relative",
            minHeight: "inherit",
            maxHeight: "inherit",
            overflowY: "auto",
          }}
        >
          {children}
        </Flex>
      </Box>
    </Box>
  )
}

export default CodeBox
