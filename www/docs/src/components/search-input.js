import React from "react"
import { Flex } from "rebass"
import { Input } from "@rebass/forms"

import SearchIcon from "./search-icon"

const SearchInput = () => (
  <Flex sx={{ marginLeft: "90px" }} alignItems="center">
    <SearchIcon />
    <Input
      sx={{ marginLeft: "10px", boxShadow: "none" }}
      placeholder="Search docs..."
    />
  </Flex>
)

export default SearchInput
