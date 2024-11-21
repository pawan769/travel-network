"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  recommendedPosts: {},
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
    setRecommendedPosts: (state, action) => {
      if (
        JSON.stringify(state.recommendedPosts) !==
        JSON.stringify(action.payload)
      ) {
        state.recommendedPosts = action.payload;
      }
    },
  },
});
export const { setUser, setRecommendedPosts } = appSlice.actions;

export default appSlice.reducer;
