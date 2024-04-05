import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/common/commonSlice";
import authReducer from "./features/auth/authSlice";
import moduleReducer from "./features/rolesPermissions/moduleSlice";
import roleReducer from "./features/rolesPermissions/roleSlice";
import permissionReducer from "./features/rolesPermissions/permissionSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    auth: authReducer,
    modules: moduleReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    users: userReducer,
  },
});
