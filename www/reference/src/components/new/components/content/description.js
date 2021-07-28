import React from "react"
import styled from "@emotion/styled"
import { Box } from "rebass"

const StyledDescription = styled(Box)`
  code {
    background-color: var(--faded);
    border-radius: 4px;
    padding: 3px;
  }
`

const Description = ({ children }) => {
  return <StyledDescription>{children}</StyledDescription>
}

export default Description
