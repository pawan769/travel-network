"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { setUser } = appSlice.actions;
// const useAppState = () => {
//   return appSlice.reducer;
// };
// export default useAppState;
export default appSlice.reducer;
