/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [pilotos, setPilotos] = useState([]);

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/users`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(res);
      setPilotos(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedPilots();
    console.log("Users Loaded");
  }, []);

  return (
    <UserContext.Provider value={{ pilotos, setPilotos }}>
      {children}
    </UserContext.Provider>
  );
};
