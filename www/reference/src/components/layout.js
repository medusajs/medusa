import { Box, Flex } from "theme-ui"

import React from "react"
import Sidebar from "./side-bar"
import styled from "@emotion/styled"

const LayoutContainer = styled(Flex)`
  --side-bar-width: 220px;

  @media screen and (min-width: 1680px) {
    --side-bar-width: 280px;
  }
`

const ContentBox = styled(Box)`
  @media screen and (min-width: 849px) {
    width: calc(100% - var(--side-bar-width));
  }

  @media screen and (max-width: 848px) {
    width: 100%;
  }
`

const Layout = ({ data, api, children }) => {
  return (
    <LayoutContainer sx={{ p: "0", m: "0", overflow: "hidden" }}>
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          fontFamily: "body",
          flexGrow: "1",
        }}
        className="layout-container"
      >
        <Sidebar data={data} api={api} />
        <ContentBox>{children}</ContentBox>
      </Flex>
    </LayoutContainer>
  )
}

export default Layout
