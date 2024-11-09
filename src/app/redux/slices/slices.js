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
      if (JSON.stringify(state.user) !== JSON.stringify(action.payload)) {
        state.user = action.payload;
      }
    },
  },
});
export const { setUser } = appSlice.actions;
// const useAppState = () => {
//   return appSlice.reducer;
// };
// export default useAppState;
export default appSlice.reducer;
