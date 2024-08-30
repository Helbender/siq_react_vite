/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import {
  Stack,
  Card,
  Flex,
  CardHeader,
  Text,
  Heading,
  Divider,
  CardBody,
  IconButton,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { useColorMode } from "@chakra-ui/react";
import axios from "axios";
import StyledText from "../styledcomponents/StyledText";
import { FlightContext } from "../../Contexts/FlightsContext";
import { useContext } from "react";

const FlightCard = ({ flight }) => {
  const { flights, setFlights } = useContext(FlightContext);

  const handleDeleteFlight = async (id) => {
    console.log(`Flight Id: ${id}`);
    try {
      const res = await axios.delete(`/api/flights/${id}`);
      // console.log(res.data);
      if (res.data?.deleted_id) {
        console.log(`Deleted flight ${res.data?.deleted_id}`);

        setFlights(flights.filter((flight) => flight.id != id));
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  // console.log(flight);
  // eslint-disable-next-line no-unused-vars
  const { colorMode, toggleColorMode } = useColorMode();

  const l = new Date(Date.parse(flight.date));

  return (
    <Card boxShadow={"lg"} bg={colorMode === "light" ? "gray.100" : "gray.700"}>
      <CardHeader>
        <Flex align={"center"}>
          <Heading>{`${flight.airtask}`} </Heading>
          <Spacer />
          <IconButton
            variant="ghost"
            colorScheme="red"
            size={"lg"}
            onClick={() => handleDeleteFlight(flight.id)}
            icon={<BiTrash />}
          />
          <Spacer />
          <Heading>{
            `${l.toLocaleDateString("pt-pt")}`
            // `${l.getDate()}-${l.getMonth() + 1}-${l.getFullYear()}`
          }</Heading>
        </Flex>
        <Divider />
      </CardHeader>
      <CardBody>
        <Flex alignItems={"top"}>
          <Stack>
            <Text>{`${flight.flightType} / ${flight.flightAction}`}</Text>
            <StyledText
              query={"Nº de Cauda"}
              text={`Nº de Cauda: ${flight.tailNumber}`}
            />
            <StyledText
              query={"Nº TRIP"}
              text={`Nº TRIP: ${flight.numberOfCrew}`}
            />

            <StyledText
              query={"Aterragens"}
              text={`Aterragens: ${flight.totalLandings}`}
            />
          </Stack>
          <Spacer />
          <Stack>
            <StyledText query={"ORM"} text={`ORM: ${flight.orm}`} />

            <StyledText
              query={["PAX", "DOE"]}
              text={`PAX/DOE: ${flight.passengers} / ${flight.doe}`}
            />
            <StyledText query={"CARGO"} text={`CARGO: ${flight.cargo} Kg`} />
            <StyledText query={"FUEL"} text={`FUEL: ${flight.fuel} Kg`} />
          </Stack>
          <Spacer />
          <Stack>
            <StyledText query={"ATD"} text={`ATD ${flight.ATD}`} />
            <StyledText query={"ATA"} text={`ATA ${flight.ATA}`} />
            <StyledText query={"ATE"} text={`ATE ${flight.ATE}`} />
            <StyledText
              query={["De", "para"]}
              text={`De ${flight.origin} para ${flight.destination}`}
            />
          </Stack>
        </Flex>
        <Divider my="5" />
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>NIP</Th>
                <Th>Nome</Th>
                <Th>ATR</Th>
                <Th>ATN</Th>
                <Th>PrecApp</Th>
                <Th>NPrecApp</Th>
                <Th>Qualifications</Th>
              </Tr>
            </Thead>
            <Tbody>
              {flight.flight_pilots.map((pilot) => {
                let qualification = [];
                if (pilot.QA1) {
                  qualification = [...qualification, "QA1"];
                }
                if (pilot.QA2) {
                  qualification = [...qualification, "QA2"];
                }
                if (pilot.BSP1) {
                  qualification = [...qualification, "BSP1"];
                }
                if (pilot.BSP2) {
                  qualification = [...qualification, "BSP2"];
                }
                if (pilot.TA) {
                  qualification = [...qualification, "TA"];
                }
                if (pilot.VRP1) {
                  qualification = [...qualification, "VRP1"];
                }
                if (pilot.VRP2) {
                  qualification = [...qualification, "VRP2"];
                }
                return (
                  <Tr key={pilot.nip}>
                    <Td>{pilot.nip}</Td>
                    <Td>{pilot.name}</Td>
                    <Td>{pilot.ATR}</Td>
                    <Td>{pilot.ATN}</Td>
                    <Td>{pilot.precapp}</Td>
                    <Td>{pilot.nprecapp}</Td>
                    <Td>
                      {qualification.length === 2
                        ? `${qualification[0]} and ${qualification[1]}`
                        : qualification[0]}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default FlightCard;
