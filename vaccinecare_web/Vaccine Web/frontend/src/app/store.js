import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { userLoggedIn } from "@/features/authSlice.js";
// import { userLoggedIn } from "@/features/auth/authSlice.js";

export const appStore = configureStore({
   reducer: rootReducer,
   middleware: (DefaultMiddleware) => DefaultMiddleware().concat(authApi.middleware),
});

// Load user from API on page refresh
const initializeApp = async () => {
   try {
      const result = await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
      
      if (result.data?.user) {
         appStore.dispatch(userLoggedIn({ user: result.data.user }));
      }
   } catch (error) {
      console.error("Failed to load user", error);
   }
};

initializeApp();

export default appStore;
