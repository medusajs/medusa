import { Flex, Box, Link, Select } from "@theme-ui/components"
import React, { useContext } from "react"
import { navigate } from "gatsby-link"

import GitHub from "../components/icons/github"
import NavigationContext from "../context/navigation-context"
import { convertToKebabCase } from "../utils/convert-to-kebab-case"
import ChevronDown from "./icons/chevron-down"
import Search from "./search"

const Topbar = ({ data, api }) => {
  const { goTo, reset, currentSection } = useContext(NavigationContext)

  const handleChange = e => {
    const parts = e.target.value.split(" ")

    if (parts[0] === api) {
      goTo({ section: parts[1] })
    } else {
      reset()
      navigate(`/api/${api === "admin" ? "store" : "admin"}`)
    }
  }

  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: "5vw",
        height: "headerHeight",
        boxShadow: "topbarShadow",
        "@media screen and (max-width: 848px)": {
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "100",
          backgroundColor: "light",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "none",
            alignItems: "center",
            "@media screen and (max-width: 848px)": {
              display: "block",
            },
          }}
        >
          <Select
            arrow={<ChevronDown fill={"dark"} />}
            sx={{
              border: "none",
              width: "100%",
              fontSize: "2",
              fontFamily: "body",
              fontWeight: "500",
              flexGrow: "1",
              px: "0",
              backgroundColor: "light",
              transition: "all .1s ease-in-out",
              "&:focus": {
                outline: "none !important",
              },
            }}
            onChange={handleChange}
            value={`${api} ${currentSection}`}
          >
            <optgroup label={`${api.slice(0, 1).toUpperCase()}${api.slice(1)}`}>
              {data.sections.map((s, i) => {
                return (
                  <option
                    key={i}
                    value={`${api} ${convertToKebabCase(
                      s.section.section_name
                    )}`}
                  >
                    {s.section.section_name}
                  </option>
                )
              })}
            </optgroup>
            <optgroup label={api === "admin" ? "Store" : "Admin"}>
              <option>{`Go to ${
                api === "admin" ? "Storefront API" : "Admin API"
              }`}</option>
            </optgroup>
          </Select>
        </Box>
      </Box>
      <Flex
        sx={{
          alignItems: "center",
          maxWidth: "400px",
          flexGrow: "1",
          justifyContent: "flex-end",
        }}
      >
        <Link variant="topbar" mr={3} href="https://docs.medusajs.com">
          Docs
        </Link>
        <Link
          sx={{
            pt: "4px",
          }}
          variant="topbar"
          href="https://github.com/medusajs/medusa"
        >
          <GitHub />
        </Link>
        <Search />
      </Flex>
    </Flex>
  )
}

export default Topbar
