import React, { useContext } from "react";
import DisplayContext from "../../context/display-context";
import StoreContext from "../../context/store-context";
import styles from "../../styles/step-overview.module.css";

const StepOverview = () => {
  const { cart } = useContext(StoreContext);
  const { checkoutStep, updateCheckoutStep } = useContext(DisplayContext);
  return (
    <div>
      <h2>Steps</h2>
      <div className={styles.doneSteps}>
        {cart?.shipping_address ? (
          <>
            <div className={styles.step}>
              <span className={styles.detail}>Contact </span>
              <div className={styles.stepInfo}>
                {cart.shipping_address.first_name}{" "}
                {cart.shipping_address.last_name}
              </div>
              <button
                className={styles.edit}
                onClick={() => updateCheckoutStep(1)}
              >
                Edit
              </button>
            </div>
            <div className={styles.step}>
              <span className={styles.detail}>Address</span>
              <div className={styles.stepInfo}>
                {cart.shipping_address.address_1}, {cart.shipping_address.city}
              </div>
              <button
                className={styles.edit}
                onClick={() => updateCheckoutStep(1)}
              >
                Edit
              </button>
            </div>
          </>
        ) : null}
        {cart?.shipping_methods[0] && checkoutStep !== 2 ? (
          <div className={styles.step}>
            <span className={styles.detail}>Shipping</span>
            <div className={styles.stepInfo}>
              {cart.shipping_methods[0].shipping_option.name}
            </div>
            <button
              className={styles.edit}
              onClick={() => updateCheckoutStep(2)}
            >
              Edit
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StepOverview;
