import axios from "axios";

const instance = axios.create({
  baseURL: "https://daychat.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
