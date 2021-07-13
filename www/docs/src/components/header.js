import React from "react"
import { Box, Flex, Button } from "rebass"
import Logo from "./logo"
import SearchInput from "./search-input"
import styles from "./header.module.css"

// const StyledHeader = styled(Box)`
//   color: white;
//   width: 100%;
//   border-bottom: 1px solid black;
//   padding: 10px 10px;
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 50px;
// `

// const StyledLink = styled(Link)`
//   color: black;
// `

const Nav = () => {
  return (
    <Box className={styles.header}>
      <Flex>
        <a href="/">
          <Logo />
        </a>
        <SearchInput />
      </Flex>

      <Box>
        <a href="https://rebassjs.org">Login</a>
        <Button
          variant="primary"
          mr={2}
          sx={{ marginLeft: 4, backgroundColor: "#4E101F", color: "#fff" }}
        >
          Sign up
        </Button>
      </Box>
    </Box>
  )
}

export default Nav
