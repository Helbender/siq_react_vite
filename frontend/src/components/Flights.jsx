/* eslint-disable react/prop-types */
import { Container, Stack, Center, FormControl, Input } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import CreateFlightModal from "./flightComponents/CreateFlightModal";
import { AuthContext } from "../Contexts/AuthContext";
import { useContext } from "react";
import { FlightContext } from "../Contexts/FlightsContext";

export default function Flights() {
  // const [flights, setFlights] = useContext(FlightContext);
  const { token } = useContext(AuthContext);
  const { flights, setFlights } = useContext(FlightContext);

  return (
    <Container maxW={"1000px"}>
      <Center>
        <CreateFlightModal
          flights={flights}
          setFlights={setFlights}
          token={token}
        />
        <FormControl textAlign={"center"} ml={5} maxW="95px">
          <Input placeholder="00A0000" textAlign={"center"} />
        </FormControl>
      </Center>
      <Stack gap={5} mt="8" mb="10" overflow="initial">
        {flights.length
          ? !!flights.length &&
            flights.map((flight) => (
              <FlightCard
                key={flight.fid}
                flight={flight}
                flights={flights}
                setFlights={setFlights}
              />
            ))
          : null}
      </Stack>
    </Container>
  );
}
