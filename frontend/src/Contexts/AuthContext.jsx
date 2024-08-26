/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import useToken from "../components/loginComponents/useToken";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const { token, removeToken, setToken } = useToken();

  const getUser = () => {
    const decodedToken = jwtDecode(token);
    return { name: decodedToken.name, admin: decodedToken.admin };
  };
  useEffect(() => {
    getSavedPilots();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        removeToken,
        setToken,
        getUser,
        pilotos,
        setPilotos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
