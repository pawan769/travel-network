"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { Loader2 } from "lucide-react";

const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<Loader2 className="animate-spin" size={40} />}
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default AppProvider;
