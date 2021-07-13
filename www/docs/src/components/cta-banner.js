import React, { useState } from "react"
import { Box, Flex } from "rebass"
import ConfLogo from "./conf-logo"
import CloseIcon from "./close-icon"
import styles from "./banner.module.css"

const Banner = props => {
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  return (
    isBannerVisible && (
      <Flex className={styles.banner} flexDirection="column">
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
      </Flex>
    )
  )
}

export default Banner
