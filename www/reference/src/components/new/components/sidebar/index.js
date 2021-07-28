import React, { useEffect, useState } from "react"
import { Flex, Image, Box, Text } from "rebass"
import styled from "@emotion/styled"
import Logo from "../../../../assets/logo.svg"
import SideBarItem from "./sidebar-item"
import SideBarSelector from "./sidebar-selector"

const SideBarContainer = styled(Flex)`
  --side-bar-header-height: 80px;
  --side-bar-width: 220px;

  position: sticky;
  top: 0;
  bottom: 0;
  height: 100vh;
  background-color: var(--light);
  box-shadow: inset -1px 0 0 0 var(--faded);
  min-width: var(--side-bar-width);
  flex-direction: column;

  @media screen and (min-width: 1680px) {
    --side-bar-width: 280px;
  }
`

const SideBarList = styled(Flex)`
  margin-right: 1px;
  flex-direction: column;
  overflow-y: scroll;

  /* Change to react-custom-scrollbars2 */
  scrollbar-color: var(--faded) var(--light);

  &::-webkit-scrollbar {
    width: 11px;
  }
  &::-webkit-scrollbar-track {
    background: var(--light);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--faded);
    border-radius: 6px;
    border: 3px solid var(--light);
  }
`

const SideBarFade = styled(Box)`
  position: absolute;
  top: var(--side-bar-header-height);
  left: 0;
  width: calc(var(--side-bar-width) - 1px);
  height: 50px;
  box-shadow: inset 0 50px 25px calc(-1 * 25px) var(--light);
  pointer-events: none;
`

const SideBarHeader = styled(Flex)`
  height: var(--side-bar-header-height);
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
    <SideBarContainer>
      <SideBarHeader
        width="100%"
        alignContent="center"
        justifyContent={"center"}
        px={4}
        pt={3}
        flexDirection="column"
      >
        <Flex width={"100%"} alignItems="center">
          <Image src={Logo} alt="Medusa logo" height="20px" />
        </Flex>
        <Flex py={3} justifyContent="space-between">
          <SideBarSelector />
        </Flex>
      </SideBarHeader>
      <SideBarFade opacity={scrollPos} />
      <SideBarList px={3} pb={3} id="nav">
        {data.sections.map((s, i) => {
          return <SideBarItem item={s} api={api} key={i} />
        })}
      </SideBarList>
    </SideBarContainer>
  )
}

export default Sidebar
