import React, { useState } from "react";
import ConfLogo from "../conf-logo";
import CloseIcon from "../close-icon";
import styles from "./banner.module.css";
import clsx from "clsx";
import useThemeContext from "@theme/hooks/useThemeContext";

const Banner = (props) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { isDarkTheme } = useThemeContext();

  return (
    isBannerVisible && (
      <div className={clsx(styles.bannerContainer, "margin-top--lg")}>
        <div
          className={clsx(styles.banner, "padding--sm", "padding-right--md")}
        >
          <div className="padding" sx={{ marginLeft: "10px" }}>
            <ConfLogo fill={isDarkTheme ? "white" : "black"} />
            <p className="padding-left--md">Callout dismissable</p>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsBannerVisible(false)}
          >
            <CloseIcon fill={isDarkTheme ? "white" : "black"} />
          </div>
        </div>
      </div>
    )
  );
};

export default Banner;
