import React, { useContext, useEffect, useState } from "react"
import { Flex, Select } from "theme-ui"
import { navigate } from "gatsby-link"
import styled from "@emotion/styled"
import NavigationContext from "../../context/navigation-context"
import ChevronDown from "../icons/chevron-down"

const Container = styled(Flex)`
  div {
    width: 100%;
  }
`

const SideBarSelector = () => {
  const [api, setApi] = useState("store")
  const { reset } = useContext(NavigationContext)

  useEffect(() => {
    const pathname = window.location.pathname
    const matches = pathname.match(/api\/(store|admin)/)
    if (matches?.length > 1) {
      setApi(matches[1])
    }
  }, [])

  const handleSelect = e => {
    reset()
    navigate(`/api/${e.target.value}`)
  }

  return (
    <Container sx={{ width: "100%" }}>
      <Select
        arrow={<ChevronDown fill={"dark"} styles={{ ml: "-28px" }} />}
        sx={{
          borderRadius: "var(--border-radius-8)",
          borderColor: "faded",
          width: "100%",
          fontSize: "1",
          fontFamily: "body",
          transition: "all .1s ease-in-out",
          "&:focus": {
            outline: "none !important",
          },
          boxShadow: "ctaBoxShadow",

          "&:hover": {
            boxShadow: "buttonBoxShadowHover",
          },
        }}
        value={api}
        onChange={handleSelect}
      >
        <option value="admin">Admin</option>
        <option value="store">Storefront</option>
      </Select>
    </Container>
  )
}

export default SideBarSelector
