import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: 0,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setTotal: (state, action) => {
      state.total = action.payload;
    },
  },
});

export const { setTotal } = commonSlice.actions;
export default commonSlice.reducer;
