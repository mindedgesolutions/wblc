import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
  selectedRoles: [],
  selectedPermissions: [],
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
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
    setSelectedRoles: (state, action) => {
      state.selectedRoles = action.payload;
    },
    underSelectedRoles: (state) => {
      state.selectedRoles = [];
    },
  },
});

export const {
  setUsers,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
  setSelectedRoles,
  underSelectedRoles,
} = userSlice.actions;
export default userSlice.reducer;
