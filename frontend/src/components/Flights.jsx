/* eslint-disable react/prop-types */
import { Container, Stack, Center, FormControl, Input } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import { useState, useEffect } from "react";
import axios from "axios";
import CreateFlightModal from "./flightComponents/CreateFlightModal";

export default function Flights({ token, setToken }) {
  const [flights, setFlights] = useState([]);

  const getSavedFlights = () => {
    try {
      axios({
        method: "GET",
        url: `/api/flights`,
        headers: { Authorization: "Bearer " + token },
      }).then((response) => {
        const res = response.data;
        res.access_token && setToken(res.access_token);
        console.log(res);
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
    <Container maxW={"1000px"}>
      <Center>
        <CreateFlightModal flights={flights} setFlights={setFlights} />
        <FormControl maxW="130px">
          <Input value="50A0000" />
        </FormControl>
      </Center>
      <Stack gap={5} mt="8" mb="10" overflow="scroll">
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
