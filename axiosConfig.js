import axios from "axios";

const instance = axios.create({
  baseURL: "https://daychat.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export default instance;
