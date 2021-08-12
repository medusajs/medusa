import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { Flex, Box } from "theme-ui"
import Sidebar from "./sidebar"

const StyledSearch = styled(Box)`
  width: 300px;
  min-height: 200px;
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  background: var(--faded);
  border-radius: 8px;
  z-index: 99;
`

const StyledLayout = styled(Flex)`
  --dark: #0a3149;
  --dark-contrast: #0a314990;
  --light: #ffffff;

  --faded: #eef0f5;
  --faded-contrast: #eef0f540;

  --border-radius-8: 8px;

  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
`

const Layout = ({ data, api, children }) => {
  const [visible, setVisible] = useState(false)

  console.log(api, data)

  // useEffect(() => {
  //   function handleKeyPress(e) {
  //     if (!visible && e.metaKey && e.key === "f") {
  //       e.preventDefault()
  //       setVisible(true)
  //     } else if (visible && e.metaKey && e.key === "f") {
  //       e.preventDefault()
  //       setVisible(false)
  //     }
  //   }
  //   window.addEventListener("keydown", handleKeyPress)
  //   return () => window.removeEventListener("keydown", handleKeyPress)
  // }, [visible])

  return (
    <StyledLayout>
      <StyledSearch
        sx={{
          display: visible ? "flex" : "none",
        }}
      ></StyledSearch>
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "scroll",
          fontFamily: "body",
          flexGrow: "1",
        }}
      >
        <Sidebar data={data} api={api} />
        <Box>{children}</Box>
      </Flex>
    </StyledLayout>
  )
}

export default Layout
