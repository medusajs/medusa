import React, { useContext } from "react";
import { PuffLoader } from "react-spinners";
import styles from "../../styles/checkout-summary.module.css";
import itemStyles from "../../styles/cart-view.module.css";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../../utils/helper-functions";
import { sum, quantity } from "../../utils/helper-functions";
import DisplayContext from "../../context/display-context";
import { formatPrices } from "../../utils/prices";

const CheckoutSummary = ({ cart }) => {
  const { orderSummary, updateOrderSummaryDisplay } =
    useContext(DisplayContext);
  return cart ? (
    <div className={`${styles.container} ${orderSummary ? styles.active : ""}`}>
      <div className={itemStyles.top}>
        <p>
          <strong>Order Summary</strong>
        </p>
        <p>
          {cart.items.length > 0 ? cart.items.map(quantity).reduce(sum) : 0}{" "}
          {cart.items.length > 0 && cart.items.map(quantity).reduce(sum) === 1
            ? "item"
            : "items"}
        </p>
        <button
          className={styles.closeBtn}
          onClick={() => updateOrderSummaryDisplay()}
        >
          X
        </button>
      </div>
      <div className={itemStyles.overview}>
        {cart.items
          .sort((a, b) => {
            const createdAtA = new Date(a.created_at),
              createdAtB = new Date(b.created_at);

            if (createdAtA < createdAtB) return -1;
            if (createdAtA > createdAtB) return 1;
            return 0;
          })
          .map((i) => {
            return (
              <div key={i.id} className={itemStyles.product}>
                <figure>
                  <Link
                    href={{
                      pathname: `/product/[id]`,
                      query: { id: i.variant.product.id },
                    }}
                    passHref
                  >
                    <a>
                      <div className={itemStyles.placeholder}>
                        <Image
                          objectFit="cover"
                          height="100%"
                          width="100%"
                          src={i.variant.product.thumbnail}
                          alt={`${i.title}`}
                        />
                      </div>
                    </a>
                  </Link>
                </figure>
                <div className={itemStyles.controls}>
                  <div>
                    <div>
                      <Link
                        href={{
                          pathname: `/product/[id]`,
                          query: { id: i.variant.product.id },
                        }}
                        passHref
                      >
                        <a>{i.title}</a>
                      </Link>
                      <p className={itemStyles.size}>Size: {i.variant.title}</p>
                      <p className={itemStyles.size}>
                        Price:{" "}
                        {formatPrices(cart, i.variant)}
                      </p>
                      <p className={itemStyles.size}>Quantity: {i.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.breakdown}>
        <p>Subtotal (incl. taxes)</p>
        <span>
          {cart.region
            ? formatPrice(cart.subtotal, cart.region.currency_code)
            : 0}
        </span>
      </div>
      <div className={styles.breakdown}>
        <p>Shipping</p>
        <span>
          {cart.region
            ? formatPrice(cart.shipping_total, cart.region.currency_code)
            : 0}
        </span>
      </div>
      <div className={styles.total}>
        <p>Total</p>
        <span>
          {cart.region ? formatPrice(cart.total, cart.region.currency_code) : 0}
        </span>
      </div>
    </div>
  ) : (
    <div className={styles.spinnerContainer}>
      <PuffLoader />
    </div>
  );
};

export default CheckoutSummary;
