import { Flex, Link, Image } from "@theme-ui/components"
import React from "react"

import GitHub from "../components/icons/github"

const Topbar = () => {
  return (
    <Flex
      sx={{
        justifyContent: "flex-end",
        width: "100%",
        px: "5vw",
        py: "2vw",
      }}
    >
      <Flex
        sx={{
          alignItems: "center",
        }}
      >
        <Link variant="topbar" mr={3} href="https://docs.medusa-commerce.com">
          Docs
        </Link>
        <Link
          sx={{
            pt: "3px",
          }}
          variant="topbar"
          href="https://github.com/medusajs/medusa"
        >
          <GitHub />
        </Link>
      </Flex>
    </Flex>
  )
}

export default Topbar
