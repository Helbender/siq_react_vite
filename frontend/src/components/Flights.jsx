/* eslint-disable react/prop-types */
import { Container, Stack, Center, FormControl, Input } from "@chakra-ui/react";
import FlightCard from "./flightComponents/FlightCard";
import CreateFlightModal from "./flightComponents/CreateFlightModal";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

export default function Flights() {
  // const [flights, setFlights] = useContext(FlightContext);
  const { token, flights, setFlights } = useContext(AuthContext);

  // const getSavedFlights = () => {
  //   try {
  //     axios({
  //       method: "GET",
  //       url: `/api/flights`,
  //       headers: { Authorization: "Bearer " + token },
  //     }).then((response) => {
  //       const res = response.data;
  //       console.log("Flights");
  //       console.log(res);
  //       // res.access_token && setToken(res.access_token);
  //       setFlights(res || []);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getSavedFlights();
  // }, []);
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
