import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  addModal: false,
  confirmModal: false,
  deleteParams: { id: "", title: "", tables: [] },
  editId: "",
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setTotal: (state, action) => {
      state.total = action.payload;
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
      state.deleteParams = { id: "", title: "", tables: [] };
    },
  },
});

export const {
  setTotal,
  showAddModal,
  hideAddModal,
  showConfirmModal,
  hideConfirmModal,
} = commonSlice.actions;
export default commonSlice.reducer;
