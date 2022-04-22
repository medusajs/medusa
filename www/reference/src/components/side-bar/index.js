import { Box, Flex, Image } from "theme-ui"
import React, { useEffect, useState } from "react"

import Logo from "../../assets/logo.svg"
import LogoDark from "../../assets/logo-dark.svg"
import LogoMuted from "../../assets/logo-muted.svg"
import SideBarItem from "./sidebar-item"
import SideBarSelector from "./sidebar-selector"
import { navigate } from "gatsby"
import styled from "@emotion/styled"
import { useColorMode } from 'theme-ui'

const SideBarContainer = styled(Flex)`
  @media screen and (max-width: 848px) {
    display: none;
  }
`

const SideBarFade = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--side-bar-width) - 1px);
  height: 50px;
  pointer-events: none;
  box-shadow: inset 0 50px 25px calc(-1 * 25px) white;
`

const Sidebar = ({ data, api }) => {
  const [scrollPos, setScrollPos] = useState(0)
  const [colorMode, setColorMode] = useColorMode()

  useEffect(() => {
    const nav = document.querySelector("#nav")

    const handleScroll = e => {
      const pos = e.srcElement.scrollTop / 50
      if (pos < 1) {
        setScrollPos(pos)
      }
    }
    nav.addEventListener("scroll", handleScroll)
    return () => nav.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <SideBarContainer
      sx={{
        position: "sticky",
        top: "0",
        bottom: "0",
        height: "100vh",
        backgroundColor: "var(--theme-ui-colors-background)",
        boxShadow: "sidebarShadow",
        minWidth: "var(--side-bar-width)",
        flexDirection: "column",
      }}
      className="sidebar-container"
    >
      <Flex
        sx={{
          px: "4",
          pt: "3",
          background: "var(--theme-ui-colors-background)",
          width: "calc(var(--side-bar-width) - 1px)",
          flexDirection: "column",
        }}
      >
        <Flex>
          <Image
            src={colorMode == 'light' ? Logo : LogoDark}
            alt="Medusa logo"
            onClick={() => navigate("/")}
            sx={{
              height: "32px",
              cursor: "pointer",
            }}
          />
        </Flex>
        <Flex py={4}>
          <SideBarSelector api={api} />
        </Flex>
      </Flex>
      <Flex
        id="nav"
        sx={{
          flex: 1,
          position: "relative",
          px: "3",
          pb: "3",
          mr: "1px",
          flexDirection: "column",
          overflowY: "scroll",
          pr: "6px",
          scrollbarColor: "faded light",
        }}
      >
        <SideBarFade opacity={scrollPos} />
        {data.sections.map((s, i) => {
          return <SideBarItem item={s} key={i} />
        })}
      </Flex>
      <Flex sx={{ py: 4, px: 4, borderTop: "1px solid var(--theme-ui-colors-separator)" }}>
        <Image src={LogoMuted} alt="Medusa Type" sx={{ height: "10px" }} />
      </Flex>
    </SideBarContainer>
  )
}

export default Sidebar
