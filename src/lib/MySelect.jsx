import React from 'react';

/** @typedef {React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>} InputAttributes */

/**
 * @typedef PropsI
 * @property {string} label
 * @property {string} name
 * @property {string} [error]
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} [validate]
 */

/**
 * @param {InputAttributes & PropsI} props
 */
const MySelect = ({
  label,
  error,
  onChange,
  onBlur,
  validate,
  children,
  ...rest
}) => {
  /** @param {React.ChangeEvent<HTMLSelectElement>} event */
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

  /** @param {React.FocusEvent<HTMLSelectElement, Element>} event */
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
      <select onChange={handleChange} onBlur={handleBlur} {...rest}>
        {children}
      </select>
      {error && (
        <p style={{ color: 'darkred', margin: 0, padding: 0 }}>{error}</p>
      )}
    </label>
  );
};

export default MySelect;
