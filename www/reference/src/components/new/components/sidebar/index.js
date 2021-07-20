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
    div.Collapsible li {
      padding-left: 1rem;
      ${Typography.Small}
    }
  }
`

const StyledHeader = styled(Flex)`
  border-bottom: 1px solid lightgrey;
  flex-direction: column;
`

const StyledSelect = styled.select`
  margin-bottom: 1rem;
`

const StyledImageContainer = styled(Box)`
  margin: 1rem 0;
`

const StyledFlex = styled(Flex)`
  padding: 1rem;
  width: 220px;
`

const isItemActive = (location, link) => {
  return location.pathname.includes(link)
}

const SidebarItem = ({ to, title }) => {
  const location = useLocation()
  const isActive = isItemActive(location, to)
  return (
    <li>
      <Link style={isActive ? { color: "green" } : {}} to={to}>
        {title}
      </Link>
    </li>
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
          {subItems.map(i => {
            return (
              <SidebarItem
                key={i.title}
                title={i.title}
                to={`/${directory}/#${i.to}`}
              />
            )
          })}
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
          admin.sections.map(({ section }) => (
            <SidebarList item={section} directory={selected.toLowerCase()} />
          ))
        )
        break
      case "Store":
        setSections(
          store.sections.map(({ section }) => (
            <SidebarList item={section} directory={selected.toLowerCase()} />
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
          <Image src={Logo} />
        </StyledImageContainer>
        <Select
          onChange={handleSelect}
          options={[{ value: "Admin" }, { value: "Store" }]}
        >
          <option key="admin">Admin</option>
          <option key="store">Store</option>
        </Select>
      </StyledHeader>
      <StyledList>{sections}</StyledList>
    </StyledFlex>
  )
}

export default Sidebar
