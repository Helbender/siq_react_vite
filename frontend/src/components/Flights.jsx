import { Container, Stack } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateFlightModal from "./flightComponents/CreateFlightModal";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";
export default function Flights() {
  const [flights, setFlights] = useState([]);

  const getSavedFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`);
      setFlights(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedFlights();
  }, []);
  return (
    <Container maxW={"1000px"}>
      <CreateFlightModal flights={flights} setFlights={setFlights} />

      <Stack gap={5} mt="8" mb="10">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </Stack>
    </Container>
  );
}
