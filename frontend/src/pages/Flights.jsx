/* eslint-disable react/prop-types */
import { Container, Stack, Center, FormControl, Input } from "@chakra-ui/react";
import FlightCard from "../components/flightComponents/FlightCard";
import CreateFlightModal from "../components/flightComponents/CreateFlightModal";
import { AuthContext } from "../Contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FlightContext } from "../Contexts/FlightsContext";

export default function Flights() {
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useContext(AuthContext);
  const { flights } = useContext(FlightContext);

  useEffect(() => {
    const results = flights.filter((flight) =>
      [
        flight.airtask,
        flight.flightType,
        flight.flightAction,
        flight.date,
        flight.origin,
        flight.destination,
        flight.tailNumber,
      ]
        .map((field) => (field ? field.toString().toLowerCase() : ""))
        .some((field) => field.includes(searchTerm.toLowerCase())),
    );
    setFilteredFlights(results);
  }, [searchTerm, flights]);

  return (
    <Container maxW={"1000px"}>
      <Center mt={10}>
        <CreateFlightModal token={token} />
        <FormControl textAlign={"center"} ml={5} maxW="130px">
          <Input
            placeholder="Search..."
            textAlign={"center"}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
      </Center>
      <Stack gap={5} mt="8" mb="10" overflow="initial">
        {filteredFlights.length
          ? !!filteredFlights.length &&
            filteredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          : null}
      </Stack>
    </Container>
  );
}
