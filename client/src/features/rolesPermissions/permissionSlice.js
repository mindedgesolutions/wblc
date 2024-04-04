import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
  userPermissionModal: false,
  userId: "",
  allPermissions: [],
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState: initialState,
  reducers: {
    setPermissions: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => b.id - a.id);
      state.permissions = sorted;
    },
    showAddModal: (state, action) => {
      state.editId = action.payload ?? "";
      state.addModal = true;
    },
    hideAddModal: (state) => {
      state.addModal = false;
      state.editId = "";
    },
    showConfirmModal: (state, action) => {
      state.confirmModal = true;
      state.deleteParams = action.payload;
    },
    hideConfirmModal: (state) => {
      state.confirmModal = false;
      state.deleteParams = {};
    },
    showUserPermissionModal: (state, action) => {
      state.userPermissionModal = true;
      state.userId = action.payload;
    },
    hideUserPermissionModal: (state) => {
      state.userPermissionModal = false;
      state.userId = "";
    },
    setAllPermissions: (state, action) => {
      state.allPermissions = action.payload;
    },
  },
});

export const {
  setPermissions,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
  showUserPermissionModal,
  hideUserPermissionModal,
  setAllPermissions,
} = permissionSlice.actions;
export default permissionSlice.reducer;
