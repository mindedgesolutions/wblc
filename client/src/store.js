import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/common/commonSlice";
import moduleReducer from "./features/rolesPermissions/moduleSlice";
import roleReducer from "./features/rolesPermissions/roleSlice";
import permissionReducer from "./features/rolesPermissions/permissionSlice";
import userReducer from "./features/users/userSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    modules: moduleReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    users: userReducer,
  },
});
