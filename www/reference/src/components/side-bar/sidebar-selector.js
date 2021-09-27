import React, { useContext } from "react"
import { Flex, Select } from "theme-ui"
import { navigate } from "gatsby-link"
import NavigationContext from "../../context/navigation-context"
import ChevronDown from "../icons/chevron-down"

const SideBarSelector = ({ api }) => {
  const { reset } = useContext(NavigationContext)

  const handleSelect = e => {
    reset()
    navigate(`/api/${e.target.value}`)
  }

  return (
    <Flex
      sx={{
        marginLeft: "-16px",
        marginRight: "-10px",
        width: "calc(100% + 26px)",
        "& div": {
          width: "100%",
        },
      }}
    >
      <Select
        arrow={<ChevronDown fill={"dark"} styles={{ ml: "-28px" }} />}
        sx={{
          paddingLeft: "16px",
          marginRight: "-5px",
          borderRadius: "small",
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
    </Flex>
  )
}

export default SideBarSelector
