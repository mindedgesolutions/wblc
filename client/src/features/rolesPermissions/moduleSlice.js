import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modules: [],
  addModal: false,
  confirmModal: false,
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
  },
});

export const { setModules } = moduleSlice.actions;
export default moduleSlice.reducer;
