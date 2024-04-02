import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
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
    },
    showConfirmModal: (state, action) => {
      state.confirmModal = true;
      state.deleteParams = action.payload;
    },
    hideConfirmModal: (state) => {
      state.confirmModal = false;
      state.deleteParams = {};
    },
  },
});

export const {
  setPermissions,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
} = permissionSlice.actions;
export default permissionSlice.reducer;
