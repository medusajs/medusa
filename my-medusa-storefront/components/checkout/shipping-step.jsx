import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/shipping-step.module.css";
import ShippingMethod from "./shipping-method";
import { BiLeftArrowAlt } from "react-icons/bi";
import DisplayContext from "../../context/display-context";
import { isEmpty } from "../../utils/helper-functions";
import StoreContext from "../../context/store-context";
import { MdError } from "react-icons/md";

const ShippingStep = ({ handleDeliverySubmit, isProcessing, cart }) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [error, setError] = useState(false);

  const { getShippingOptions } = useContext(StoreContext);
  const { updateCheckoutStep } = useContext(DisplayContext);

  useEffect(() => {
    // Wait until the customer has entered their address information
    if (!cart.shipping_address?.country_code) {
      return;
    }

    getShippingOptions().then((partitioned) => {
      setShippingOptions(partitioned);
    });

    //if method is already selected, then preselect
    if (cart.shipping_methods.length > 0) {
      setSelectedOption(cart.shipping_methods[0].shipping_option);
    }
  }, [cart, setSelectedOption, getShippingOptions]);

  const handleSelectOption = (o) => {
    setSelectedOption(o);

    if (error) {
      setError(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setError(true);
    } else {
      handleDeliverySubmit(selectedOption);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Delivery</h2>
      {isEmpty(shippingOptions) || isProcessing ? (
        <div>loading...</div>
      ) : (
        <div>
          {shippingOptions.map((so) => {
            return (
              <div key={so.id}>
                <ShippingMethod
                  option={so}
                  chosen={selectedOption}
                  handleOption={handleSelectOption}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className={`${styles.error} ${error ? styles.active : ""} `}>
        <MdError />
        <p>Select a shipping method</p>
      </div>
      <div className={styles.controls}>
        <button
          className={styles.stepBack}
          onClick={() => updateCheckoutStep(1)}
        >
          <BiLeftArrowAlt /> Back to information
        </button>
        <button className={styles.nextBtn} onClick={handleSubmit}>
          <span id="button-text">Next</span>
        </button>
      </div>
    </div>
  );
};

export default ShippingStep;
