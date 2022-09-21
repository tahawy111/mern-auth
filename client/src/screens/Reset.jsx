import authSvg from "../assests/reset.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosIntance from "./../helpers/axios";

const Reset = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
  });

  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password1 === formData.password2 &&
      formData.password1 &&
      formData.password2
    ) {
      try {
        const res = await axiosIntance.put(`/auth/password/reset`, {
          newPassword: formData.password1,
          resetPasswordLink: token,
        });
        setFormData({ ...formData, password1: "", password2: "" });
        toast.success(res.data.message);
      } catch (error) {
        toast.error(
          "Something is wrong. Please try again",
          error.response.data.message
        );
      }
    } else {
      toast.error("Passwords don't matches");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Reset Your Password
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <form
                className="mx-auto max-w-xs relative "
                onSubmit={handleSubmit}
              >
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="password"
                  name="password1"
                  onChange={handleChange}
                  value={formData.password1}
                />
                <input
                  className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Confirm password"
                  name="password2"
                  onChange={handleChange}
                  value={formData.password2}
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span className="ml-3">Submit</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Reset;
