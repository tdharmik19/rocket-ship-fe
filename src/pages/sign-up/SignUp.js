import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field } from '../../common/components';

const SignUp = () => {
  const navigate = useNavigate();
  const [signupInput, setSignupInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    setSignupInput({
      ...signupInput,
      [id]: value,
    });
  };

  const handleSubmit = () => {
    navigate('/');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mb-8 text-center text-4xl font-bold">
        <h1>ShipRocket</h1>
      </div>
      <div className="bg-body mb-3 w-8/12 rounded-2xl bg-white px-12 py-6 shadow md:w-5/12">
        <div className="mb-2 text-center">
          <h3 className="m-0 text-xl font-medium">Get Started with a free account</h3>
        </div>
        <span className="my-2 inline-flex w-full border border-dashed border-gray-400"></span>
        <form>
          <div className="flex w-full gap-2">
            <Field
              type={'text'}
              id={'firstName'}
              label={'First Name'}
              placeHolder={'First name'}
              required={true}
              value={signupInput['firstName']}
              onChange={handleChangeInput}
            />
            <Field
              type={'text'}
              id={'lastName'}
              label={'Last Name'}
              placeHolder={'Last name'}
              required={true}
              value={signupInput['lastName']}
              onChange={handleChangeInput}
            />
          </div>
          <Field
            type={'email'}
            id={'email'}
            label={'Email ID'}
            placeHolder={'Enter your email ID'}
            required={true}
            value={signupInput['email']}
            onChange={handleChangeInput}
          />
          <Field
            type={'password'}
            id={'password'}
            label={'Password'}
            placeHolder={'Enter password'}
            required={true}
            value={signupInput['password']}
            onChange={handleChangeInput}
          />
          <div className="mb-3 text-sm">
            {`By clicking Sign up for Free, you agree to Shiprocket's `}
            <Link to={'/login'} className="text-decoration-none text-blue-700">
              {'Terms Of Service and Privacy Policy.'}
            </Link>
          </div>
          <button
            type="button"
            className="dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mb-2 w-full rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300"
            onClick={handleSubmit}
          >
            Sign up for Free
          </button>
          <div className="text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to={'/login'} className="text-decoration-none text-blue-700">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
