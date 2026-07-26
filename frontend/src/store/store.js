import { configureStore } from "@reduxjs/toolkit";
import complaintsReducer from "./complaintsSlice.js";
import aiReducer from "./aiSlice.js";

export const store = configureStore({
  reducer: {
    complaints: complaintsReducer,
    ai: aiReducer,
  },
});
