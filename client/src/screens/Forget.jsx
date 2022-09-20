import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import authSvg from "../assests/forget.svg";
import axiosIntance from "../helpers/axios";

const Forget = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email) {
      try {
        const res = await axiosIntance.post("/auth/password/forget", {
          email: formData.email,
        });
        setFormData({ ...formData, email: "" });
        toast.success("Please check your email");
      } catch (error) {
        toast.error(error.response.data.error);
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <h1 className="text-2xl xl:text-3xl text-center font-extrabold">
            Forget Password
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
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                <span className="ml-3">Submit</span>
              </button>
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

export default Forget;
