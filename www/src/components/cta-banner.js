import React, { useState } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"

import ConfLogo from "./conf-logo"
import CloseIcon from "./close-icon"

const StyledBanner = styled(Flex)`
  width: 867px;
  height: 102px;
  display: flex;
  padding: 10px 0px;
  margin-bottom: 50px;
  background-color: #f0f0f0;
  border-radius: 5px;
`

const Banner = props => {
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  return (
    isBannerVisible && (
      <StyledBanner flexDirection="column">
        <Flex flexDirection="row" justifyContent="space-between">
          <Box sx={{ marginLeft: "10px" }}>
            <ConfLogo />
            <p style={{ marginLeft: "10px" }}>Callout dismissable</p>
          </Box>
          <Box
            sx={{ width: "20px", height: "20px", cursor: "pointer" }}
            onClick={() => setIsBannerVisible(false)}
          >
            <CloseIcon />
          </Box>
        </Flex>
      </StyledBanner>
    )
  )
}

export default Banner
