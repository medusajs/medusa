import { Flex, Link, Select } from "@theme-ui/components"
import React, { useContext, useEffect, useState } from "react"
import { convertToKebabCase } from "../utils/convert-to-kebab-case"
import ChevronDown from "./icons/chevron-down"
import { navigate } from "gatsby-link"
import { DocSearch } from "@docsearch/react"
import "../medusa-plugin-themes/docsearch/theme.css"

import GitHub from "../components/icons/github"
import NavigationContext from "../context/navigation-context"

const Topbar = ({ data, api }) => {
  const { goTo, reset, currentSection } = useContext(NavigationContext)
  const [isMobile, setIsMobile] = useState(false)

  const handleChange = e => {
    const parts = e.target.value.split(" ")

    if (parts[0] === api) {
      goTo({ section: parts[1] })
    } else {
      reset()
      navigate(`/api/${api === "admin" ? "store" : "admin"}`)
    }
  }

  useEffect(() => {
    const reportWindowSize = () => {
      if (window && window.innerWidth <= 848) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }
    window.addEventListener("resize", reportWindowSize)
    return () => window.removeEventListener("resize", reportWindowSize)
  }, [])

  return (
    <Flex
      sx={{
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
          zIndex: "200",
          backgroundColor: "light",
        },
      }}
    >
      <Flex
        sx={{
          width: "100%",
          "@media screen and (max-width: 848px)": {
            justifyContent: "space-between",
          },
        }}
      >
        {isMobile && (
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
        )}
        <Flex
          sx={{
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            "@media screen and (max-width: 848px)": {
              justifyContent: "flex-end",
            },
          }}
        >
          <DocSearch
            indexName="docsearch"
            apiKey="25626fae796133dc1e734c6bcaaeac3c"
            placeholder="Search API reference"
          />
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <Link
              variant="topbar"
              mr={3}
              href="https://docs.medusa-commerce.com"
            >
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Topbar
