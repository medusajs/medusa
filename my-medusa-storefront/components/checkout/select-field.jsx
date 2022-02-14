import React from "react";
import { Field } from "formik";
import * as styles from "../../styles/input-field.module.css";
import { MdError } from "react-icons/md";

const SelectField = ({ id, error, errorMsg, type, disabled, options }) => {
  return options ? (
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
          className={styles.styledselect}
          type={type}
          disabled={disabled}
          as="select"
        >
          {options.map((o) => {
            return (
              <option key={o.id} value={o.iso_2}>
                {o.display_name}
              </option>
            );
          })}
        </Field>
        {error && <MdError className={styles.erroricon} />}
      </div>
    </div>
  ) : (
    <div className={styles.fetching} />
  );
};

export default SelectField;
