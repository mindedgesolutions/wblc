import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
  rolePermissionModal: false,
  selectedRole: "",
};

const roleSlice = createSlice({
  name: "roles",
  initialState: initialState,
  reducers: {
    setRoles: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => b.id - a.id);
      state.roles = sorted;
    },
    showAddModal: (state, action) => {
      state.editId = action.payload ?? "";
      state.addModal = true;
    },
    hideAddModal: (state) => {
      state.addModal = false;
    },
    showConfirmModal: (state, action) => {
      state.confirmModal = true;
      state.deleteParams = action.payload;
    },
    hideConfirmModal: (state) => {
      state.confirmModal = false;
      state.deleteParams = {};
    },
    showRolePermissionModal: (state, action) => {
      state.rolePermissionModal = true;
      state.selectedRole = action.payload;
    },
    hideRolePermissionModal: (state) => {
      state.rolePermissionModal = false;
      state.selectedRole = "";
    },
  },
});

export const {
  setRoles,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
  showRolePermissionModal,
  hideRolePermissionModal,
} = roleSlice.actions;
export default roleSlice.reducer;
