import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modules: [],
  addModal: false,
  confirmModal: false,
  deleteParams: {},
  editId: "",
};

const moduleSlice = createSlice({
  name: "modules",
  initialState: initialState,
  reducers: {
    setModules: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => b.id - a.id);
      state.modules = sorted;
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
  setModules,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
} = moduleSlice.actions;
export default moduleSlice.reducer;
