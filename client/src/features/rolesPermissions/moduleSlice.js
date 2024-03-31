import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modules: [],
  addModal: false,
  confirmModal: false,
  editModal: false,
  deleteParams: { id: "", title: "", tables: [] },
};

const moduleSlice = createSlice({
  name: "modules",
  initialState: initialState,
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload;
    },
    showAddModal: (state) => {
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
      state.deleteParams = { id: "", title: "", tables: [] };
    },
    showEditModal: (state) => {
      state.editModal = true;
    },
    hideEditModal: (state) => {
      state.editModal = false;
    },
  },
});

export const {
  setModules,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
  showEditModal,
  hideEditModal,
} = moduleSlice.actions;
export default moduleSlice.reducer;
