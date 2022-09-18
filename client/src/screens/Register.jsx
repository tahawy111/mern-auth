import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import authSvg from "../assests/auth.svg";
import { authenticate, isAuth } from "../helpers/auth";
import axiosIntance from "../helpers/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password1) {
      if (formData.password1 === formData.password2) {
        try {
          const res = await axiosIntance.post("/auth/register", {
            name: formData.name,
            email: formData.email,
            password: formData.password1,
          });
          setFormData({
            ...formData,
            name: "",
            email: "",
            password1: "",
            password2: "",
          });

          toast.success(res.data.message);
        } catch (error) {
          toast.success(error.response.data.error);
        }
      } else {
        toast.error("Passwords don't matches");
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
          <h1 className="text-2xl xl:text-3xl font-extrabold">
            Sign Up for TAHAWY
          </h1>
          <form
            className="w-full flex-1 mt-8 text-indigo-500"
            onSubmit={handleSubmit}
          >
            <div className="mx-auto max-w-xs relative">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                name="name"
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
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
              <input
                type="text"
                placeholder="Confirm Password"
                value={formData.password2}
                name="password2"
                onChange={handleChange}
                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                <span className="ml-3">Register</span>
              </button>
            </div>
            <div className="my-12 border-b text-center">
              <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                Or sign with email or social login
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
                <span className="ml-4">Sign In</span>
              </a>
            </div>
          </form>
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

export default Register;
