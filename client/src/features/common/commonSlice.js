import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
  changeCount: 0,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    updateCount: (state) => {
      state.changeCount += 1;
    },
  },
});

export const { setTotal, updateCount } = commonSlice.actions;
export default commonSlice.reducer;
