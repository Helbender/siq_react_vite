import React from "react";
import ReactDOM from "react-dom/client";
// import './index.css';
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./Contexts/AuthContext";
import { FlightProvider } from "./Contexts/FlightsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <FlightProvider>
          <App />
        </FlightProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
