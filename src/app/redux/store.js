"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: local storage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import appReducer from "./slices/slices";

// Persist configuration
const persistConfig = {
  key: "root",
  storage, // Uses localStorage by default
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Configure store
const store = configureStore({
  reducer: {
    app: persistedReducer, // Use persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
