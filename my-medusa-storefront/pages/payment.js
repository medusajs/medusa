import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store-context";
import itemStyles from "../styles/cart-view.module.css";
import styles from "../styles/payment.module.css";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../utils/helper-functions";

const style = {
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

export const Payment = () => {
  const [order, setOrder] = useState();
  const { cart, completeCart, createCart } = useContext(StoreContext);

  useEffect(() => {
    if (cart.items.length > 0) {
      completeCart().then((order) => {
        setOrder(order);
        createCart();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !order || !styles ? (
    <div style={style}>
      <p>Hang on while we validate your payment...</p>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order Summary</h1>
        <p>Thank you for your order!</p>
      </div>
      <div className={styles.items}>
        {order.items
          .sort((a, b) => {
            const createdAtA = new Date(a.created_at),
              createdAtB = new Date(b.created_at);

            if (createdAtA < createdAtB) return -1;
            if (createdAtA > createdAtB) return 1;
            return 0;
          })
          .map((i) => {
            return (
              <div key={i.id} className={styles.item}>
                <div className={itemStyles.product}>
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
                        <p className={itemStyles.size}>
                          Size: {i.variant.title}
                        </p>
                        <p className={itemStyles.size}>
                          Price:{" "}
                          {formatPrice(i.unit_price, order.currency_code)}
                        </p>
                        <p className={itemStyles.size}>
                          Quantity: {i.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={styles.breakdown}>
        <div className={styles.price}>
          <div>Subtotal</div>
          <div>{formatPrice(order.subtotal, order.region.currency_code)}</div>
        </div>
        <div className={styles.price}>
          <div>Shipping</div>
          <div>
            {formatPrice(order.shipping_total, order.region.currency_code)}
          </div>
        </div>
        <div className={`${styles.price} ${styles.total}`}>
          <div>Total</div>
          <div>{formatPrice(order.total, order.region.currency_code)}</div>
        </div>
      </div>
      <div>
        <p>An order confirmation will be sent to you at {order.email}</p>
      </div>
    </div>
  );
};

export default Payment;
