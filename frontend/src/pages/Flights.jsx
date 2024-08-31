/* eslint-disable react/prop-types */
import {
  Stack,
  FormControl,
  Input,
  Text,
  VStack,
  Flex,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import FlightCard from "../components/flightComponents/FlightCard";
import CreateFlightModal from "../components/flightComponents/CreateFlightModal";
import { useContext, useEffect, useState } from "react";
import { FlightContext } from "../Contexts/FlightsContext";

export default function Flights() {
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useColorModeValue();
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
    <VStack mt={10}>
      <Flex w={"1000px"} alignItems={"center"} flex={"row"}>
        <Text ml={10}>{`Numero de Voos: ${flights.length}`}</Text>
        <Spacer />
        <CreateFlightModal />
        <FormControl textAlign={"center"} ml={5} maxW="130px">
          <Input
            placeholder="Search..."
            textAlign={"center"}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        <Spacer />

        <Text mr={10}>
          {`Voos filtrados: ${filteredFlights.length}`}
          {/* {!searchTerm ? null : `Voos filtrados: ${filteredFlights.length}`} */}
        </Text>
      </Flex>
      <Stack gap={5} mt="8" overflowY="scroll" w={"90%"} maxW={"1200px"}>
        {filteredFlights.length
          ? !!filteredFlights.length &&
            filteredFlights
              .slice(0, 5)
              .map((flight) => <FlightCard key={flight.id} flight={flight} />)
          : null}
      </Stack>
    </VStack>
  );
}
