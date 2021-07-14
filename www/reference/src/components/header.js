import React from "react"
import { Box, Flex, Button } from "rebass"
import { Link } from "gatsby"
import styled from "@emotion/styled"

import Logo from "./logo"
import SearchInput from "./search-input"

const StyledHeader = styled(Box)`
  color: white;
  width: 100%;
  border-bottom: 1px solid black;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
`

const StyledLink = styled(Link)`
  color: black;
`

const Nav = () => {
  return (
    <StyledHeader>
      <Flex>
        <StyledLink to="/">
          <Logo />
        </StyledLink>
        <SearchInput />
      </Flex>

      <Box>
        <Link href="https://rebassjs.org">Login</Link>
        <Button
          variant="primary"
          mr={2}
          sx={{ marginLeft: 4, backgroundColor: "#4E101F", color: "#fff" }}
        >
          Sign up
        </Button>
      </Box>
    </StyledHeader>
  )
}

export default Nav
