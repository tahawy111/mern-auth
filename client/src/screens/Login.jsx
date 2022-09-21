import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authSvg from "../assests/login.svg";
import { authenticate, isAuth } from "../helpers/auth";
import axiosIntance from "../helpers/axios";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Login = () => {
  // Support Google Auth
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  });

  const [formData, setFormData] = useState({
    email: "",
    password1: "",
  });

  const navigate = useNavigate();

  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });

  const sendFacebookToken = async (userId, accessToken) => {
    try {
      const res = await axiosIntance.post("/auth/facebooklogin", {
        userId,
        accessToken,
      });
      informParent(res);
    } catch (error) {
      toast.error("Facebook Auth error");
    }
  };

  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken);
  };

  const sendGoogleLogin = async (idToken) => {
    try {
      const res = await axiosIntance.post("/auth/googlelogin", {
        idToken,
      });

      informParent(res);
    } catch (error) {
      toast.error("Google login error");
    }
  };

  const informParent = (res) => {
    localStorage.user && JSON.parse(localStorage.user).role === "Admin"
      ? navigate("/admin")
      : navigate("/private");

    authenticate(res);
  };

  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleLogin(response.tokenId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password1) {
      try {
        const res = await axiosIntance.post("/auth/login", {
          email: formData.email,
          password: formData.password1,
        });
        authenticate(res);
        localStorage.user && JSON.parse(localStorage.user).role === "Admin"
          ? navigate("/admin")
          : navigate("/private");
        toast.success(`Hey ${res.data.user.name}, Welcome back`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Navigate to="/" /> : null}
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="text-2xl xl:text-3xl text-center font-extrabold">
            Login for TAHAWY
          </h1>
          <form
            className="w-full flex-1 mt-8 text-indigo-500"
            onSubmit={handleSubmit}
          >
            <div className="mx-auto max-w-xs relative">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              <input
                type="text"
                placeholder="Password"
                value={formData.password1}
                name="password1"
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                <span className="ml-3">Login</span>
              </button>
              <Link
                to="/users/password/forget"
                className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
              >
                Forget password?
              </Link>
            </div>

            <div className="my-12 border-b text-center">
              <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                Or Sign Up
              </div>
            </div>
            <div className="flex flex-col items-center">
              <a
                className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                href="/login"
                target="_self"
              >
                <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                <span className="ml-4">Sign Up</span>
              </a>
            </div>
          </form>
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={`single_host_origin`}
            render={(renderProps) => (
              <button
                style={{ marginLeft: "3.5rem" }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className=" mt-6 w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
              >
                <div className=" p-2 rounded-full ">
                  <i className="fab fa-google " />
                </div>
                <span className="ml-4">Sign In with Google</span>
              </button>
            )}
          />
          <FacebookLogin
            appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
            autoLoad={false}
            callback={responseFacebook}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                style={{ marginLeft: "3.5rem" }}
                disabled={renderProps.isDisabled}
                className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
              >
                <div className=" p-2 rounded-full ">
                  <i className="fab fa-facebook" />
                </div>
                <span className="ml-4">Sign In with Facebook</span>
              </button>
            )}
          />
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
