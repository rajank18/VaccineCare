import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
   user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
   isAuthenticated: !!Cookies.get("authToken"), // Check if auth token exists in cookies
};

const authSlice = createSlice({
   name: "authSlice",
   initialState,
   reducers: {
      userLoggedIn: (state, action) => {
         state.user = action.payload.user;
         state.isAuthenticated = true;

         // Save user in localStorage
         localStorage.setItem("user", JSON.stringify(action.payload.user));
      },
      userLoggedOut: (state) => {
         state.user = null;
         state.isAuthenticated = false;

         // Remove user from localStorage
         localStorage.removeItem("user");
      }
   }
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
