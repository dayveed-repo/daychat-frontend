import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import appReducer from "./reducer";

const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
    },
  });

const wrapper = createWrapper(makeStore);
export default wrapper;
