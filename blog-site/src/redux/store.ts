import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./AuthSlice/SignUp";
import { BlogSlice } from "./BlogSlice/BlogSlice";



export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    blogs: BlogSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;