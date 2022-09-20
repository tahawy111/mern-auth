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
        const res = await axiosIntance.put(`/auth/resetPassword`, {
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
    }
  };

  return <div>Reset</div>;
};

export default Reset;
