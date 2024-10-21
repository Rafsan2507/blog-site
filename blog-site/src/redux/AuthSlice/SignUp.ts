import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface UserState {
  users: Partial<User>[];
  authenticatedUser: User | null;
  loginError: string | null;
}

const initialState: UserState = {
  users: [],
  authenticatedUser: null,
  loginError: null,
};

export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userInfo: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      UserInfo.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      }
    );
    builder.addCase(
      LogUserInfo.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.authenticatedUser = action.payload;
        state.loginError = null;
      }
    );
    builder.addCase(LogUserInfo.pending, (state) => {
      state.authenticatedUser = null;
      state.loginError = null;
    });
    builder.addCase(LogUserInfo.rejected, (state, action) => {
      state.loginError = "Invalid email or password";
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.authenticatedUser = null;
    });
},
});

export const UserInfo = createAsyncThunk(
  "users/UserInfo",
  async (users: User) => {
    const response = await axios.post("http://localhost:5000/users", users);
    return response.data;
  }
);

export const LogUserInfo = createAsyncThunk(
  "users/LogUserInfo",
  async (userData: User) => {
    const response = await axios.get("http://localhost:5000/users");
    const users = response.data;

    const user = users.find(
      (u: User) =>
        u.email === userData.email && u.password === userData.password
    );

    if (user) {
      return user;
    } else {
      throw new Error("Invalid credentials");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("user");
    return Promise.resolve();
  }
);

export default UserSlice.reducer;
