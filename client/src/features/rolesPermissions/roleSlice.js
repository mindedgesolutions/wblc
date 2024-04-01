import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
};

const roleSlice = createSlice({
  name: "roles",
  initialState: initialState,
  reducers: {
    setRoles: (state, action) => {
      const sorted = [...action.payload].sort((a, b) => b.id - a.id);
      state.roles = sorted;
    },
  },
});

export const { setRoles } = roleSlice.actions;
export default roleSlice.reducer;
