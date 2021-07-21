import React, { useEffect, useState } from "react"
import { Box, Flex, Image } from "rebass"
import Collapsible from "react-collapsible"
import { Link, navigate } from "gatsby"
import { useLocation } from "@reach/router"
import styled from "@emotion/styled"
import Typography from "../../../typography"
import Logo from "../../../../assets/logo.svg"
import Select from "../../../select"

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding: 5px 0;
    div.Collapsible ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    div.Collapsible li {
      padding-left: 1rem;
      ${Typography.Small}
    }
  }
`

const StyledHeader = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  height: 80px;
  width: 250px;
  flex-direction: column;
  padding-left: 1rem;
  z-index: 6;
`

const StyledImageContainer = styled(Box)`
  margin: 1rem 0;
`

const StyledFlex = styled(Flex)`
  --bg: #f0f0f0;
  min-width: 220px;
  position: sticky;
  height: 100vh;
  top: 0;
  background: var(--bg);
`

const StyledNavigation = styled(Flex)`
  position: absolute;
  padding: 1rem;
  top: 80px;
  width: 100%;
  left: 0;
  overflow-y: auto;
  height: 100%;
`

const FadeBox = styled(Box)`
  position: absolute;
  top: 50px;
  left: 0;
  height: 50px;
  width: 205px;
  box-shadow: inset 0 50px 25px calc(-1 * 25px) var(--bg);
  z-index: 5;
`

const isItemActive = (location, link) => {
  return location.pathname.includes(link)
}

const SidebarItem = ({ to, title }) => {
  const location = useLocation()
  const isActive = isItemActive(location, to)
  return (
    <Link style={isActive ? { color: "green" } : {}} to={to}>
      {title}
    </Link>
  )
}

const SidebarList = ({ item, directory = "" }) => {
  const subItems = item.paths
    .map(p => {
      return p.methods
    })
    .reduce((pre, cur) => {
      return pre.concat(cur)
    })
    .map(m => {
      return {
        title: m.summary,
        to: m.summary.replace(/ /g, "_").toLowerCase(),
      }
    })
  const hasSubitems = subItems.length > 0
  const location = useLocation()
  const isActiveDirectory =
    hasSubitems && location.pathname.includes(`/${directory}/${item.id}/`)

  return (
    <li>
      {hasSubitems ? (
        <Collapsible
          open={isActiveDirectory}
          trigger={item.section_name}
          onTriggerOpening={() =>
            navigate(`/#${item.section_name.replace(/ /g, "_").toLowerCase()}`)
          }
        >
          <ul>
            {subItems.map((item, index) => {
              return (
                <li key={index}>
                  <SidebarItem
                    title={item.title}
                    to={`/${directory}/#${item.to}`}
                  />
                </li>
              )
            })}
          </ul>
        </Collapsible>
      ) : (
        <SidebarItem
          title={item.section_name}
          to={`/${directory}/#${item.section_name}`}
        />
      )}
    </li>
  )
}

const Sidebar = ({ data }) => {
  const [selected, setSelected] = useState("Admin")
  const [sections, setSections] = useState(null)

  const { store, admin } = data

  useEffect(() => {
    switch (selected) {
      case "Admin":
        setSections(
          admin.sections.map(({ section }, i) => (
            <SidebarList
              key={i}
              item={section}
              directory={selected.toLowerCase()}
            />
          ))
        )
        break
      case "Store":
        setSections(
          store.sections.map(({ section }, i) => (
            <SidebarList
              key={i}
              item={section}
              directory={selected.toLowerCase()}
            />
          ))
        )
        break
      default:
        break
    }
  }, [selected])

  const handleSelect = e => {
    setSelected(e.target.value)
  }
  return (
    <StyledFlex flexDirection="column">
      <StyledHeader flexDirection="column">
        <StyledImageContainer>
          <Image src={Logo} height="24px" />
        </StyledImageContainer>
        <Select
          onChange={handleSelect}
          options={[{ value: "Admin" }, { value: "Store" }]}
        >
          <option key="admin">Admin</option>
          <option key="store">Store</option>
        </Select>
      </StyledHeader>
      <FadeBox />
      <StyledNavigation>
        <StyledList>{sections}</StyledList>
      </StyledNavigation>
    </StyledFlex>
  )
}

export default Sidebar
