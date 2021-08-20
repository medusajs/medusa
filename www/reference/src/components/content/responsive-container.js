import React from "react"
import styled from "@emotion/styled"
import { Flex } from "theme-ui"

const ResponsiveFlex = styled(Flex)`
  .info {
    width: 55%;
  }

  .code {
    width: 45%;
  }

  @media screen and (max-width: 848px) {
    flex-direction: column;
    align-items: center;

    .info,
    .code {
      width: 100%;
    }
  }
`

const ResponsiveContainer = ({ children }) => {
  return <ResponsiveFlex>{children}</ResponsiveFlex>
}

export default ResponsiveContainer
