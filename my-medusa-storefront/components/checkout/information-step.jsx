import React, { useContext } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import PuffLoader from "react-spinners/PuffLoader";
import styles from "../../styles/information-step.module.css";
import InputField from "./input-field";
import SelectField from "./select-field";
import StoreContext from "../../context/store-context";

const InformationStep = ({ handleSubmit, savedValues, isProcessing }) => {
  const { cart } = useContext(StoreContext);
  let Schema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("Required"),
    last_name: Yup.string()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    address_1: Yup.string()
      .required("Required")
      .max(45, "Limit on 45 characters"),
    address_2: Yup.string().nullable(true).max(45, "Limit on 45 characters"),
    country_code: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    postal_code: Yup.string().required("Required"),
    province: Yup.string().nullable(true),
    phone: Yup.string().required("Required"),
  });

  return (
    <div style={{ flexGrow: "1" }}>
      <h2>Address</h2>
      <Formik
        initialValues={{
          first_name: savedValues.first_name || "",
          last_name: savedValues.last_name || "",
          email: savedValues.email || "",
          address_1: savedValues.address_1 || "",
          address_2: savedValues.address_2 || "",
          country_code: savedValues.country_code || 
            cart?.region?.countries?.[0].iso_2 ||
            "",
          postal_code: savedValues.postal_code || "",
          city: savedValues.city || "",
          phone: savedValues.phone || "",
        }}
        validationSchema={Schema}
        onSubmit={(values) => {
          const { email, ...rest } = values;
          handleSubmit(rest, email);
        }}
      >
        {({ errors, touched, values }) => (
          <Form className={styles.styledform}>
            {isProcessing ? (
              <div className={styles.spinner}>
                <PuffLoader loading={true} size={60} />
              </div>
            ) : (
              <>
                <div className={styles.sharedrow}>
                  <InputField
                    id="first_name"
                    placeholder="First Name"
                    error={errors.first_name && touched.first_name}
                    errorMsg={errors.first_name}
                    type="text"
                  />
                  <InputField
                    id="last_name"
                    placeholder="Last Name"
                    error={errors.last_name && touched.last_name}
                    errorMsg={errors.last_name}
                    val={values.last_name}
                    type="text"
                  />
                </div>
                <InputField
                  id="email"
                  placeholder="Email"
                  error={errors.email && touched.email}
                  errorMsg={errors.email}
                  type="email"
                />
                <InputField
                  id="address_1"
                  placeholder="Address 1"
                  error={errors.address_1 && touched.address_1}
                  errorMsg={errors.address_1}
                  type="text"
                />
                <InputField
                  id="address_2"
                  placeholder="Address 2 (Optional)"
                  error={errors.address_2 && touched.address_2}
                  errorMsg={errors.address_2}
                  type="text"
                />
                <SelectField
                  id="country_code"
                  options={cart.region?.countries}
                  error={errors.country_code && touched.country_code}
                  errorMsg={errors.country_code}
                />
                <div className={styles.sharedrow}>
                  <InputField
                    id="city"
                    placeholder="City"
                    error={errors.city && touched.city}
                    errorMsg={errors.city}
                    type="text"
                  />
                  <InputField
                    id="postal_code"
                    placeholder="Postal Code"
                    error={errors.postal_code && touched.postal_code}
                    errorMsg={errors.postal_code}
                    type="text"
                  />
                </div>
                <InputField
                  id="phone"
                  placeholder="Phone"
                  error={errors.phone && touched.phone}
                  errorMsg={errors.phone}
                  type="tel"
                />
                <div className={styles.btncontainer}>
                  <button className={styles.formbtn} type="submit">
                    Next
                  </button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InformationStep;
