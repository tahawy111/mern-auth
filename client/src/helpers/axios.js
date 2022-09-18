import axios from "axios";

const axiosIntance = axios.create({
  baseURL: "http://localhost:5000/api",
  //     headers: {
  //       authorization: token ? `Bearer ${token}` : "",
  //     },
});

export default axiosIntance;
