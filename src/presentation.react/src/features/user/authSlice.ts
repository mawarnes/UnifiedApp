import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type RootState } from "../../app/store";
import { jwtDecode } from "jwt-decode";
import { logout } from "./authAPI";

export interface iUser {
  Id: string;
  RoleClaim: Array<string>;
  UserName: string;
}
export interface iAuthState {
  status: "idle" | "loading" | "failed";
  accessToken?: string;
  refreshToken?: string;
  user?: iUser;
}

const initialState: iAuthState = {
  status: "idle",
};
export const logoutAsync = createAsyncThunk("user/logout", async () => {
  const response = await logout();
  // The value we return becomes the `fulfilled` action payload
  return response?.data;
});
export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = jwtDecode<iUser>(action.payload.accessToken);
    },
    resetToken: (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.user = undefined;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    resetLoading: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.accessToken = undefined;
        state.refreshToken = undefined;
        state.user = undefined;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateToken, resetToken, setLoading, resetLoading } =
  authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfile",
  async (profile: { userName: string; email: string; phoneNumber?: string }, thunkAPI) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Return the updated profile as if it was saved on the server
    return profile;
  }
);