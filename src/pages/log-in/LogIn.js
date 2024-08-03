import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../common/utils/env.config';
import OtpPopup from './OtpPopup';
import { homelogo, LogoRCSL } from '../../common/images';
import loginLogo from '../../common/images/loginLogo.png';
import { Loader } from '../../common/components';
import deliveryCarLogo from '../../common/images/delivery-car.png';
import { ACCESS_TOKEN } from '../../common/utils/config';
import logo from '../../common/images/logo.png';

// import { GoogleLogin } from 'react-google-login';
// import {gapi} from 'gapi-script'

export let type_user;

const LogIn = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [handlePopup, setHandlePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState({
    username: '',
    password: '',
  });
  const [userType, setUserType] = useState('user');
  type_user = userType;

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    setLoginInput({
      ...loginInput,
      [id]: value,
    });
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    type_user = userType;
    // console.log("DATAAAAAAAAA",data)
    navigate('/forgotpassword');
  };
  //   var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  //   function start() {
  //     gapi.client.init({
  //         clientId: "285163063974-00ubuj8sg12diejh6j2hn3mq845d5ngn.apps.googleusercontent.com",
  //         scope: SCOPES,
  //     });
  // }
  //   gapi.load("client:auth2", start);

  const handleSubmit = () => {
    if (loginInput.username === '' || loginInput.password === '') {
      toast('Email and Password both are required', { type: 'error' });
      return;
    }

    sessionStorage.setItem('user_email', loginInput.username);

    const apiURL = `/login/access-token?type=${userType}`;
    const otpURL = userType === 'user' ? '/login' : '/company';
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: ACCESS_TOKEN,
    };

    setLoading(true);
    console.log(BACKEND_URL + apiURL);
    axios
      .post(
        BACKEND_URL + apiURL,
        {
          username: loginInput.username.toLowerCase(),
          password: loginInput.password,
        },
        { headers: headers },
      )
      .then((response) => {
        setLoading(false);

        if (response.data.access_token) {
          sessionStorage.setItem('user_id', response.data.user_id);
          sessionStorage.setItem('company_id', response.data.company_id);
          sessionStorage.setItem('is_company', response.data.is_company);
          sessionStorage.setItem('is_admin', response.data.is_admin);
          sessionStorage.setItem('balance', response.data.wallet_balance);
          sessionStorage.setItem('is_kyc', response.data.kyc_status_id);
          sessionStorage.setItem('is_super', response.data.user_type_id);
          sessionStorage.setItem('is_otpVerified', JSON.stringify(false));
          sessionStorage.setItem('access_token', response.data.access_token);
          sessionStorage.setItem('user_name', response.data?.user_name?.split(' ')[0]);

          const user_id =
            userType === 'user' ? sessionStorage.getItem('user_id') : sessionStorage.getItem('company_id');
          setUserId(response.data.user_id);
          setCompanyId(response.data.company_id);

          const otpPayload = {
            email_id: String(loginInput.username),
            [userType === 'user' ? 'user_id' : 'comp_id']: String(user_id),
          };

          let headers2 = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
          };
          axios
            .post(
              BACKEND_URL +
                `${otpURL}/generate_otp?email_id=${loginInput.username}&${
                  userType === 'user' ? 'user_id' : 'comp_id'
                }=${user_id}`,
              otpPayload,
              { headers: headers2 },
            )
            .then((otpResponse) => {
              setHandlePopup(true);
              console.log(otpResponse);
            })
            .catch((otpError) => {
              setLoading(false);
              console.error('Error fetching OTP:', otpError);
              toast('Error generating OTP', { type: 'error' });
            });
        } else if (response.data.msg) {
          toast(response.data.msg, { type: 'error' });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Login error:', error);
        toast('An error occurred during login', { type: 'error' });
      });
  };

  // const onSuccess = (response) => {
  //   console.log('Login Success:', response);
  //   // Handle the response here, e.g., send it to your backend for authentication
  // };

  // const onError = (response) => {
  //   console.log('Login Failed:', response);
  //   // Handle the failed login here
  // };

  return (
    <>
      {loading && <Loader />}
      <div className="flex-column flex h-full">
        <div className="flex h-full w-1/2 flex-col items-center justify-center">
          <img src={loginLogo} className="self-between h-[85%] w-[85%] object-cover" alt="Logo"></img>
          {/* <p className="my-5 self-end text-4xl font-medium">From Anywhere To Anywhere, Anytime</p> */}
        </div>
        <div className="mt-8 flex h-full w-[49%] flex-col items-center justify-center">
          <div className="mb-8 text-center text-4xl font-bold">
            <h1>Welcome to Book Truck</h1>
          </div>
          {!handlePopup && (
            <div className="bg-body mb-3 w-[95%] rounded-2xl bg-white px-12 py-6 shadow md:w-9/12">
              <div className="mb-2 text-center">
                <h3 className="m-0 text-xl font-medium">Login to your account</h3>
              </div>
              {/* <GoogleLogin
                clientId="285163063974-00ubuj8sg12diejh6j2hn3mq845d5ngn.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onError}
                cookiePolicy={"single_host_origin"}
            /> */}
              <div className="mb-3 flex flex-row">
                <div className="p-2">
                  <input
                    type="radio"
                    id="user"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={() => setUserType('user')}
                  />
                  <label className="ml-2 font-semibold" htmlFor="user">
                    User
                  </label>
                </div>
                <div className="p-2">
                  <input
                    type="radio"
                    id="company"
                    name="userType"
                    value="company"
                    checked={userType === 'company'}
                    onChange={() => setUserType('company')}
                  />
                  <label className="ml-2 font-semibold" htmlFor="company">
                    Company
                  </label>
                </div>
              </div>
              <span className="my-2 inline-flex w-full border border-dashed border-gray-400"></span>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Email ID
                  </label>
                  <input
                    type="email"
                    id="username"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Enter your email ID"
                    value={loginInput.username}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Enter password"
                    value={loginInput.password}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="mb-3 text-sm">
                  <Link onClick={handleForgotPassword} className="text-decoration-none text-primary">
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="button"
                  className="dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary mb-2 w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-dark focus:outline-none focus:ring-4 focus:ring-primary"
                  onClick={handleSubmit}>
                  Login
                </button>
                {userType === 'company' && (
                  <div className="text-center">
                    <p className="text-sm">
                      New to Truck Booking?{' '}
                      {/* <Link to={'/signup'} className="text-decoration-none text-red-700">
                Sign Up Now
              </Link> */}
                      <Link
                        to={userType === 'user' ? '/signup-user' : '/signup'}
                        className="text-decoration-none text-primary">
                        Sign Up Now
                      </Link>
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
          {handlePopup && (
            <OtpPopup
              userType={userType}
              username={loginInput.username}
              userId={userId}
              companyId={companyId}
            />
          )}
          <div className="ml-auto mt-10 flex flex-row items-center">
            <h1 className="ml-auto  text-xl font-bold text-primary">Powered By</h1>
            <div className="relative h-40 w-60">
              <img
                src={logo}
                className="absolute right-10 top-0 h-full w-full object-cover mix-blend-multiply"
                alt="Powered By Logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
