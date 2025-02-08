"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  recommendedPosts: {},
  mapToggle: false,
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
    setMapToggle: (state, action) => {
      if (JSON.stringify(state.mapToggle) !== JSON.stringify(action.payload)) {
        state.mapToggle = action.payload;
      }
    },
  },
});
export const { setUser, setRecommendedPosts, setMapToggle } = appSlice.actions;

export default appSlice.reducer;
