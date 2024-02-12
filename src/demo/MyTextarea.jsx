import React from 'react';

/** @typedef {React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>} TextareaAttributes */

/**
 * @typedef PropsI
 * @property {string} label
 * @property {string} name
 * @property {string} [error]
 * @property {(event: React.ChangeEvent<HTMLTextAreaElement>) => void} [validate]
 */

/**
 * @param {TextareaAttributes & PropsI} props
 */
const MyTextarea = ({ label, error, onChange, onBlur, validate, ...rest }) => {
  /** @param {React.ChangeEvent<HTMLTextAreaElement>} event */
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

  /** @param {React.FocusEvent<HTMLTextAreaElement, Element>} event */
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
      <textarea onChange={handleChange} onBlur={handleBlur} {...rest} />
      {error && (
        <p style={{ color: 'darkred', margin: 0, padding: 0 }}>{error}</p>
      )}
    </label>
  );
};

export default MyTextarea;
