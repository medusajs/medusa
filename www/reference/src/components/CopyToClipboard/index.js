import { Box, Text } from "theme-ui"
import React, { useState } from "react"

import Clipboard from '../icons/clipboard'
import ReactTooltip from "react-tooltip"
import copy from 'copy-to-clipboard'
import styled from "@emotion/styled"

const StyledTooltip = ({id, text}) => {
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

const CopyToClipboard = ({text, copyText, tooltipText}) => {
  const [copied, setCopied] = useState(false)
  const id = (Math.random()*1000000).toString()
  const forceTooltipRemount = copied ? "content-1" : "content-2"

  const onCopyClicked = () => {
    copy(copyText || tooltipText, {format: 'text/plain'})
  }

  return (
    <Box
      mr={1}
      onMouseLeave={() => {setCopied(false)}}
      onClick={() => {
        setCopied(true)
        onCopyClicked()
      }} 
      data-for={id}
      data-tip={forceTooltipRemount}
      key={forceTooltipRemount}
      sx={{cursor: 'pointer'}}
      >
        {
          text && (
            <Text variant="small" mr={2} sx={{ fontWeight: "300" }}>
              {text.toUpperCase()}
            </Text>)
        }
        <Clipboard/> 
        {copied ? 
          <StyledTooltip id={id} text={"Copied!"} />
          : 
          <StyledTooltip id={id} text={tooltipText} />
          }
    </Box>)
}

export default CopyToClipboard