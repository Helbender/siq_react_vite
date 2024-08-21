/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import useToken from "./components/loginComponents/useToken";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const { token, removeToken, setToken } = useToken();
  const [flights, setFlights] = useState([]);
  const [pilotos, setPilotos] = useState([]);

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/pilots`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log("Pilots");
      console.log(res);
      setPilotos(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const getSavedFlights = () => {
    try {
      axios({
        method: "GET",
        url: `/api/flights`,
        headers: { Authorization: "Bearer " + token },
      }).then((response) => {
        const res = response.data;
        console.log("Flights");
        console.log(res);
        // res.access_token && setToken(res.access_token);
        setFlights(res || []);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = () => {
    const decodedToken = jwtDecode(token);
    return decodedToken.name;
  };
  useEffect(() => {
    getSavedFlights();
    getSavedPilots();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        removeToken,
        setToken,
        getUser,
        flights,
        setFlights,
        pilotos,
        setPilotos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
