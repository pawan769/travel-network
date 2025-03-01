"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  recommendedPosts: {},
  mapToggle: false,
  modalOpen: false,
  itemUserMatrix: {},
  recommendedScores: {},
  similarityMatrix: {},
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
    setModalOpen: (state, action) => {
      if (JSON.stringify(state.modalOpen) !== JSON.stringify(action.payload)) {
        state.modalOpen = action.payload;
      }
    },
    setItemUserMatrix: (state, action) => {
      if (
        JSON.stringify(state.itemUserMatrix) !== JSON.stringify(action.payload)
      ) {
        state.itemUserMatrix = action.payload;
      }
    },
    setRecommendedScores: (state, action) => {
      if (
        JSON.stringify(state.recommendedScores) !==
        JSON.stringify(action.payload)
      ) {
        state.recommendedScores = action.payload;
      }
    },
    setSimilarityMatrix: (state, action) => {
      if (
        JSON.stringify(state.similarityMatrix) !==
        JSON.stringify(action.payload)
      ) {
        state.similarityMatrix = action.payload;
      }
    },
  },
});
export const {
  setModalOpen,
  setUser,
  setRecommendedPosts,
  setMapToggle,
  setItemUserMatrix,
  setRecommendedScores,
  setSimilarityMatrix,
} = appSlice.actions;

export default appSlice.reducer;
