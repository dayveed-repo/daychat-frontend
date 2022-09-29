import axios from "axios";

const instance = axios.create({
  baseURL: "https://daychat.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
