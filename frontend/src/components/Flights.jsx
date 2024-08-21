/* eslint-disable react/prop-types */
import { Container, Stack, Center, FormControl, Input } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CreateFlightModal from "./flightComponents/CreateFlightModal";
import { AuthContext } from "../Context";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const { token, setToken } = useContext(AuthContext);

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
        res.access_token && setToken(res.access_token);
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
        <CreateFlightModal
          flights={flights}
          setFlights={setFlights}
          token={token}
        />
        <FormControl maxW="130px">
          <Input placeholder="00A0000" />
        </FormControl>
      </Center>
      <Stack gap={5} mt="8" mb="10" overflow="scroll">
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
