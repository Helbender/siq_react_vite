/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

// Create the context
export const FlightContext = createContext();

// Create a provider component
export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const { token } = useContext(AuthContext);

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

  useEffect(() => {
    getSavedFlights();
  }, []);

  return (
    <FlightContext.Provider value={{ flights, setFlights }}>
      {children}
    </FlightContext.Provider>
  );
};
