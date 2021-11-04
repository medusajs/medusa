import React, { useState } from "react"
import { Flex, Box, Text } from "theme-ui"
import Clipboard from '../icons/clipboard'
import ReactTooltip from "react-tooltip"
import styled from "@emotion/styled"

const ToolTip = ({id, text}) => {
  const StyledTooltip = styled(ReactTooltip)`
      box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.08),
        0px 0px 0px 1px rgba(136, 152, 170, 0.1),
        0px 4px 4px 0px rgba(136, 152, 170, 0.1) !important;
      padding: 8px 12px;
      &:after {
        margin-right: 4px;
      }
      &.show {
        opacity: 1;
      }
    `
  return(
    <StyledTooltip
      place="top"
      backgroundColor='#FFF'
      textColor='black'
      effect="solid"
      id={id}
      sx={{ boxShadow: `0px 5px 15px 0px rgba(0, 0, 0, 0.08),
      0px 0px 0px 1px rgba(136, 152, 170, 0.1),
      0px 4px 4px 0px rgba(136, 152, 170, 0.1) !important`,
      padding: `8px 12px`
    }}
    >
        <Text>{text}</Text>
    </StyledTooltip>
  )
}

const CodeBox = ({ header, children, shell, copyClicked }) => {
  const [copied, setCopied] = useState(false)
  const id = (Math.random()*1000000).toString()
  const forceTooltipRemount = copied ? "content-1" : "content-2"
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
        {shell ? 
          <Box
            onMouseLeave={() => {setCopied(false)}}
            onClick={() => {
              setCopied(true)
              copyClicked()
            }} 
            data-for={id}
            data-tip={forceTooltipRemount}
            key={forceTooltipRemount}
            >
              <Clipboard/> 
              {copied ? 
                <ToolTip id={id} text={"Copied!"} />
                : 
                <ToolTip id={id} text={"Copy to clipboard!"} />
                }
            </Box> : 
          <></>}
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
