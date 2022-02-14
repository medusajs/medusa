import React, { useContext } from "react";
import DisplayContext from "../../context/display-context";
import styles from "../../styles/blur.module.css";

const Blur = () => {
  const { cartView, updateCartViewDisplay } = useContext(DisplayContext);
  return (
    <div
      className={`${styles.blur} ${cartView ? styles.active : null}`}
      onClick={() => updateCartViewDisplay()}
      onKeyDown={() => updateCartViewDisplay()}
      role="button"
      tabIndex="-1"
      aria-label="Close cart view"
    />
  );
};

export default Blur;
