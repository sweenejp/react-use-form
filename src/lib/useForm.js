import { useState } from 'react';
import hasError from './hasError';

/** @typedef {string | number | readonly string[]} Value */
/** @typedef {(value: Value, allValues?: Values) => string} Validator */
/** @typedef {Record<string, {value: Value, error?: string, validator?: Validator}>} Form */
/** @typedef {Record<string, Value>} Values */
/** @typedef {Record<string, string | undefined>} Errors */
/** @typedef {Record<string, Validator | undefined>} Validators */
/** @typedef {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} InputElement */
/**
 * @typedef SubmitCallbacks
 * @property {React.Dispatch<React.SetStateAction<Errors>>} setErrors
 * @property {React.Dispatch<React.SetStateAction<Values>>} setValues
 */

/**
 * @param {Form} form
 * @param {(values: Record<string, Value>, callbacks: SubmitCallbacks) => void} onSubmit
 * */
const useForm = (form, onSubmit) => {
  /** @type {Values} */
  const initValues = {};
  /** @type {Errors} */
  const initErrors = {};
  /** @type {Validators} */
  const validators = {};

  Object.entries(form).forEach(([inputName, input]) => {
    initValues[inputName] = input.value;
    initErrors[inputName] = input.error;
    validators[inputName] = input.validator;
  });

  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState(initErrors);

  /**
   * @param {string} inputName
   * @param {object} [options]
   * @param {(event: React.ChangeEvent<InputElement>) => void} [options.onChange]
   * */
  const register = (inputName, { onChange } = {}) => {
    const value = values[inputName];
    const error = errors[inputName];

    /** @param {React.ChangeEvent<InputElement>} event */
    const handleChange = (event) => {
      if (onChange) {
        onChange(event);
      }
      const { value } = event.target;
      setValues((prev) => ({
        ...prev,
        [inputName]: value,
      }));
    };

    /** @param {React.ChangeEvent<InputElement>} event */
    const validate = (event) => {
      const { value } = event.target;

      const nativeError = hasError(event.target);
      const customError = validators[inputName]?.(value, values);
      const error = nativeError || customError;

      setErrors((prev) => ({
        ...prev,
        [inputName]: error,
      }));
    };

    return {
      value,
      error,
      onChange: handleChange,
      validate,
      name: inputName,
    };
  };

  const isValid = Object.values(errors).every((error) => !error);

  /** @param {React.FormEvent<HTMLFormElement>} event */
  const handleSubmit = (event) => {
    event.preventDefault();

    /** @type {Errors} */
    const newErrors = {};

    event.target
      // @ts-ignore
      .querySelectorAll('input, textarea, select')
      .forEach(
        (
          /** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ inputEl
        ) => {
          const validator = validators?.[inputEl.name] || function () {};

          const error = validator(inputEl.value, values) || hasError(inputEl);

          if (!error) {
            return;
          }

          // focus the first input that has an error
          if (Object.values(newErrors).every((err) => !err)) {
            inputEl.focus();
          }

          newErrors[inputEl.name] = error;
        }
      );

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => Boolean(err))) {
      return;
    }

    onSubmit(values, { setErrors, setValues });
  };

  return { register, isValid, handleSubmit };
};

export default useForm;
