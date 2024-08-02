/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import {
  Card,
  Flex,
  CardHeader,
  Text,
  Heading,
  Divider,
  CardBody,
  IconButton,
  Spacer,
  Highlight,
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

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

const FlightCard = ({ flight, flights, setFlights }) => {
  const handleDeleteFlight = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/flights/${id}`);
      console.log(res.data);
      if (res.data?.deleted_id) {
        setFlights(flights.filter((flight) => flight.id != id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(flight);
  // eslint-disable-next-line no-unused-vars
  const { colorMode, toggleColorMode } = useColorMode();
  let color = colorMode === "light" ? "black" : "white";

  const l = new Date(Date.parse(flight.date));

  return (
    <Card>
      <CardHeader>
        <Flex align={"center"}>
          <Heading>{`${flight.airtask} ${flight.id}`} </Heading>
          <Spacer />
          <IconButton
            variant="ghost"
            colorScheme="red"
            size={"lg"}
            onClick={() => handleDeleteFlight(flight.id)}
            icon={<BiTrash />}
          />
          <Spacer />
          <Heading>{`${l.getDate()}-${l.getMonth() + 1}-${l.getFullYear()}`}</Heading>
        </Flex>
        <Divider />
      </CardHeader>
      <CardBody>
        <Text>
          <Highlight
            query="ATD"
            styles={{ color: color, fontWeight: "bold" }}
          >{`ATD ${flight.ATD}`}</Highlight>
        </Text>
        <Text>
          <Highlight
            query="ATA"
            styles={{ color: color, fontWeight: "bold" }}
          >{`ATA ${flight.ATA}`}</Highlight>
        </Text>
        <Text>
          <Highlight
            query={["De", "para"]}
            styles={{ color: color, fontWeight: "bold" }}
          >{`De ${flight.origin} para ${flight.destination}`}</Highlight>
        </Text>
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
                    <Td>{pilot.pilotName}</Td>
                    <Td>{pilot.ATR}</Td>
                    <Td>{pilot.ATN}</Td>
                    <Td>{pilot.P}</Td>
                    <Td>{pilot.NP}</Td>
                    <Td>{qualification}</Td>
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
