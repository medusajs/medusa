import React from "react";
import { Field } from "formik";
import styles from "../../styles/input-field.module.css";
import { MdError } from "react-icons/md";

const InputField = ({ id, placeholder, error, errorMsg, type, disabled }) => {
  return (
    <div className={styles.container}>
      {error ? (
        <p className={styles.errortext}>{errorMsg}</p>
      ) : (
        <p className={styles.fill} aria-hidden="true">
          fill
        </p>
      )}
      <div
        className={`${styles.fieldcontainer} ${error ? styles.errorfield : ""}`}
      >
        <Field
          id={id}
          name={id}
          placeholder={placeholder}
          className={styles.styledfield}
          type={type}
          disabled={disabled}
        />
        {error && <MdError className={styles.erroricon} />}
      </div>
    </div>
  );
};

export default InputField;
