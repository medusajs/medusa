import React, { useEffect, useState } from "react"

import CloseIcon from "../close-icon"
import ConfLogo from "../../../static/img/logo.svg"
import clsx from "clsx"
import styles from "./banner.module.css"
import {useColorMode} from '@docusaurus/theme-common';

const Banner = (props) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const { isDarkTheme } = useColorMode()

  const handleDismissBanner = () => {
    setIsBannerVisible(false)
    if (localStorage) {
      localStorage.setItem("mc::banner", false)
    }
  }

  useEffect(() => {
    if (localStorage) {
      const shouldShow = localStorage.getItem("mc::banner")
      if (!shouldShow) {
        setIsBannerVisible(true)
      }

      if (shouldShow === "false") {
        setIsBannerVisible(false)
      }
    }
  }, [])

  return (
    isBannerVisible && (
      <div className={clsx(styles.bannerContainer, "margin-top--lg")}>
        <div
          className={clsx(styles.banner, "padding--sm", "padding-right--md")}
        >
          <div className="padding" sx={{ marginLeft: "10px" }}>
            <ConfLogo />
            <p className="padding-left--md">
              We are still working on building out our documentation and guides,
              but if you are interested in learning more please reach out - we
              would love to jump on a call with you and help you get set up!
            </p>
          </div>
          {/* <div style={{ cursor: "pointer" }} onClick={handleDismissBanner}>
            <CloseIcon fill={isDarkTheme ? "white" : "black"} />
          </div> */}
        </div>
      </div>
    )
  )
}

export default Banner
