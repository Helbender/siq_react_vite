import { Container, Stack } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateFlightModal from "./flightComponents/CreateFlightModal";

export default function Flights() {
  const [flights, setFlights] = useState([]);

  const getSavedFlights = async () => {
    try {
      const res = await axios.get(`/api/flights`);
      console.log(res.data);
      setFlights(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  // const getSavedFlights = () => {
  //   try {
  //     const res = fetch(`/api/flights`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setFlights(data);
  //       });
  //     // if (res.ok) {
  //     //   const json = res.json();
  //     //   console.log(json);
  //     // }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  useEffect(() => {
    getSavedFlights();
  }, []);
  return (
    <Container maxW={"1000px"}>
      <CreateFlightModal flights={flights} setFlights={setFlights} />
      <Stack gap={5} mt="8" mb="10">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            flights={flights}
            setFlights={setFlights}
          />
        ))}
      </Stack>
    </Container>
  );
}
