import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
  rolePermissionModal: false,
  userPermissionModal: false,
  selectedRole: "",
  changeCount: 0,
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
      console.log(action.payload.permissions);
    },
    hideRolePermissionModal: (state) => {
      state.rolePermissionModal = false;
      state.selectedRole = "";
    },
    updateCount: (state, action) => {
      state.changeCount += 1;
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
  updateCount,
} = roleSlice.actions;
export default roleSlice.reducer;
