import React, { createContext, useContext, useState } from "react";

const BackendStatusContext = createContext();

export function BackendStatusProvider({ children }) {
  const [maintenance, setMaintenance] = useState(false);
  return <BackendStatusContext.Provider value={{ maintenance, setMaintenance }}>{children}</BackendStatusContext.Provider>;
}

export function useBackendStatus() {
  return useContext(BackendStatusContext);
}
