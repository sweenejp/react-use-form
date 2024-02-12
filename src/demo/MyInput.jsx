import React from 'react';

/** @typedef {React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>} InputAttributes */

/**
 * @typedef PropsI
 * @property {string} label
 * @property {string} name
 * @property {string} [error]
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} [validate]
 */

/**
 * @param {InputAttributes & PropsI} props
 */
const MyInput = ({ label, error, onChange, onBlur, validate, ...rest }) => {
  /** @param {React.ChangeEvent<HTMLInputElement>} event */
  function handleChange(event) {
    if (!event.target) {
      return;
    }

    onChange?.(event);

    // validate on input change only if there is an existing error
    if (!error) {
      return;
    }

    validate?.(event);
  }

  /** @param {React.FocusEvent<HTMLInputElement, Element>} event */
  function handleBlur(event) {
    if (!event.target) {
      return;
    }

    onBlur?.(event);

    validate?.(event);
  }

  return (
    <label
      style={{
        display: 'flex',
        gap: '6px',
        flexDirection: 'column',
        width: '400px',
      }}
    >
      {label}
      <input onChange={handleChange} onBlur={handleBlur} {...rest} />
      {error && (
        <p style={{ color: 'darkred', margin: 0, padding: 0 }}>{error}</p>
      )}
    </label>
  );
};

export default MyInput;
