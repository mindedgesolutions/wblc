import { configureStore } from "@reduxjs/toolkit";
import moduleReducer from "./features/rolesPermissions/moduleSlice";
import commonReducer from "./features/common/commonSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    modules: moduleReducer,
  },
});
