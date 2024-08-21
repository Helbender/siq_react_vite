/* eslint-disable react/prop-types */
import { createContext } from "react";
import useToken from "./components/loginComponents/useToken";
import { jwtDecode } from "jwt-decode";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const { token, removeToken, setToken } = useToken();
  const getUser = () => {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.admin, decodedToken.name);
    return decodedToken.name;
  };
  return (
    <AuthContext.Provider value={{ token, removeToken, setToken, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
