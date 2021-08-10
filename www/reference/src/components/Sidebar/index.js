import React, { useContext, useEffect, useState } from "react"
import { Flex, Image, Box } from "theme-ui"
import styled from "@emotion/styled"
import Logo from "../../assets/logo.svg"
import SideBarItem from "./sidebar-item"
import SideBarSelector from "./sidebar-selector"
import NavigationContext from "../../context/navigation-context"

const SideBarContainer = styled(Flex)`
  --side-bar-header-height: 100px;
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
  padding-right: 6px;
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
  min-height: var(--side-bar-header-height);
  height: var(--side-bar-header-height);
  background: var(--light);
  width: calc(var(--side-bar-width) - 1px);
  flex-direction: column;
`

const Sidebar = ({ data, api }) => {
  const [scrollPos, setScrollPos] = useState(0)
  // const {} = useContext(NavigationContext)

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
      <SideBarHeader px={4} pt={3}>
        <Flex>
          <Image
            src={Logo}
            alt="Medusa logo"
            sx={{
              height: "24px",
            }}
          />
        </Flex>
        <Flex py={3}>
          <SideBarSelector />
        </Flex>
      </SideBarHeader>
      <SideBarFade opacity={scrollPos} />
      <SideBarList
        id="nav"
        sx={{
          px: "3",
          pb: "3",
        }}
      >
        {data.sections.map((s, i) => {
          return <SideBarItem item={s} api={api} key={i} />
        })}
      </SideBarList>
    </SideBarContainer>
  )
}

export default Sidebar
