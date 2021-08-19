import React, { useEffect, useState } from "react"
import { Flex, Image, Box } from "theme-ui"
import styled from "@emotion/styled"
import Logo from "../../assets/logo.svg"
import LogoMuted from "../../assets/logo-muted.svg"
import SideBarItem from "./sidebar-item"
import SideBarSelector from "./sidebar-selector"

const SideBarContainer = styled(Flex)`
  --side-bar-width: 220px;

  @media screen and (min-width: 1680px) {
    --side-bar-width: 280px;
  }

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
        backgroundColor: "light",
        boxShadow: "sidebarShadow",
        minWidth: "var(--side-bar-width)",
        flexDirection: "column",
      }}
    >
      <Flex
        sx={{
          px: "4",
          pt: "3",
          background: "light",
          width: "calc(var(--side-bar-width) - 1px)",
          flexDirection: "column",
        }}
      >
        <Flex>
          <Image
            src={Logo}
            alt="Medusa logo"
            sx={{
              height: "28px",
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
      <Flex sx={{ py: 4, px: 4, borderTop: "1px solid #efefef" }}>
        <Image src={LogoMuted} alt="Medusa Type" sx={{ height: "10px" }} />
      </Flex>
    </SideBarContainer>
  )
}

export default Sidebar
