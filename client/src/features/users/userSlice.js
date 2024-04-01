import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
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
  setUsers,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
} = userSlice.actions;
export default userSlice.reducer;
