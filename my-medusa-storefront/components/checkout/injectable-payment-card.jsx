import React, { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import StoreContext from "../../context/store-context";
import DisplayContext from "../../context/display-context";
import styles from "../../styles/injectable-payment-card.module.css";
import { BiLeftArrowAlt } from "react-icons/bi";

const InjectablePaymentCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const { cart, completeCart } = useContext(StoreContext);
  const { updateCheckoutStep } = useContext(DisplayContext);

  const router = useRouter();

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(
      cart.payment_session.data.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );
    if (payload.error) {
      setError(`${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      router.push(`/payment`);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement
        className={styles.cardForm}
        id="card-element"
        onChange={handleChange}
      />
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      <div className={styles.controls}>
        <button
          className={styles.stepBack}
          onClick={() => updateCheckoutStep(2)}
        >
          <BiLeftArrowAlt /> Back to shipping method
        </button>
        <button
          className={styles.payBtn}
          disabled={processing || disabled || succeeded}
          id="submit"
        >
          <span id="button-text">{processing ? "Processing" : "Pay"}</span>
        </button>
      </div>
    </form>
  );
};

export default InjectablePaymentCard;
