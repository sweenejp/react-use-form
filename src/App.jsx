import React from 'react';
import MyInput from './lib/MyInput';
import useForm from './lib/useForm';
import mockFetch from './lib/mockFetch';

const App = () => {
  const { register, isValid, handleSubmit } = useForm(
    {
      email: {
        value: '',
        error: '',
        validator: (emailValue) => {
          if (emailValue === 'llama@gmail.com') {
            return 'Pick a different email ya jabroni';
          }

          return '';
        },
      },
      emailCc: {
        value: '',
        error: '',
        validator: (emailCcValue, formValues) => {
          if (emailCcValue === formValues?.email) {
            return 'please provide a different email than the main email';
          }
          return '';
        },
      },
      website: {
        value: '',
        error: '',
      },
      name: {
        value: '',
        error: '',
      },
      puppies: {
        value: '',
        error: '',
      },
    },
    async (values, setErrors) => {
      const res = await mockFetch(values);
      setErrors(res.data);
    }
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      noValidate
    >
      <MyInput
        label="Email"
        type="email"
        placeholder="enter your email"
        required
        {...register('email')}
      />
      <MyInput
        label="CC Email"
        type="email"
        placeholder="enter an email to cc"
        {...register('emailCc')}
      />
      <MyInput
        label="Website"
        type="url"
        placeholder="enter your website"
        {...register('website')}
      />
      <MyInput
        label="Name"
        type="text"
        placeholder="enter your name"
        required
        {...register('name')}
      />
      <MyInput
        label="Number of puppies"
        type="number"
        min={3}
        max={99}
        placeholder="how many do you need?"
        required
        {...register('puppies')}
      />
      <button disabled={!isValid}>Submit</button>
    </form>
  );
};

export default App;
