import React, { useEffect, useState, useContext } from "react";
import Image from "next/image"
import { BiShoppingBag } from "react-icons/bi";
import StoreContext from "../../context/store-context";
import { formatPrice, resetOptions } from "../../utils/helper-functions";
import styles from "../../styles/product.module.css";
import { createClient } from "../../utils/client";
import { formatPrices } from "../../utils/prices";

const Product = ({ product }) => {
  const { addVariantToCart, cart } = useContext(StoreContext);
  const [options, setOptions] = useState({
    variantId: "",
    quantity: 0,
    size: "",
  });

  useEffect(() => {
    if (product) {
      setOptions(resetOptions(product));
    }
  }, [product]);

  const handleQtyChange = (action) => {
    if (action === "inc") {
      if (
        options.quantity <
        product.variants.find(({ id }) => id === options.variantId)
          .inventory_quantity
      )
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity + 1,
          size: options.size,
        });
    }
    if (action === "dec") {
      if (options.quantity > 1)
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity - 1,
          size: options.size,
        });
    }
  };

  const handleAddToBag = () => {
    addVariantToCart({
      variantId: options.variantId,
      quantity: options.quantity,
    });
    if (product) setOptions(resetOptions(product));
  };

  return (
    <div className={styles.container}>
      <figure className={styles.image}>
        <div className={styles.placeholder}>
          <Image
            objectFit="cover"
            layout="fill"
            loading="eager"
            src={product.thumbnail}
            alt={`${product.title}`}
          />
        </div>
      </figure>
      <div className={styles.info}>
        <span />
        <div className={styles.details}>
          <div className="title">
            <h1>{product.title}</h1>
          </div>
          <p className="price">{formatPrices(cart, product.variants[0])}</p>
          <div className={styles.selection}>
            <p>Select Size</p>
            <div className="selectors">
              {product.variants
                .slice(0)
                .reverse()
                .map((v) => {
                  return (
                    <button
                      key={v.id}
                      className={`${styles.sizebtn} ${
                        v.title === options.size ? styles.selected : null
                      }`}
                      onClick={() =>
                        setOptions({
                          variantId: v.id,
                          quantity: options.quantity,
                          size: v.title,
                        })
                      }
                    >
                      {v.title}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className={styles.selection}>
            <p>Select Quantity</p>
            <div className={styles.qty}>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("dec")}
              >
                -
              </button>
              <span className={styles.ticker}>{options.quantity}</span>
              <button
                className={styles.qtybtn}
                onClick={() => handleQtyChange("inc")}
              >
                +
              </button>
            </div>
          </div>
          <button className={styles.addbtn} onClick={() => handleAddToBag()}>
            <span>Add to bag</span>
            <BiShoppingBag />
          </button>
          <div className={styles.tabs}>
            <div className="tab-titles">
              <button className={styles.tabtitle}>Product Description</button>
            </div>
            <div className="tab-content">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//create a Medusa client
const client = createClient();

export async function getStaticPaths() {
  // Call an external API endpoint to get products
  const { products } = await client.products.list();

  // Get the paths we want to pre-render based on the products
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the product `id`.
  // If the route is like /product/prod_1, then params.id is 1
  const { product } = await client.products.retrieve(params.id);

  // Pass post data to the page via props
  return { props: { product } };
}

export default Product;
