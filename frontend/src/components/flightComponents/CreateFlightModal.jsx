/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  GridItem,
  Grid,
  Divider,
  // Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import PilotInput from "./PilotInput";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

function CreateFlightModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState({
    airtask: "",
    date: "",
    origin: "",
    destination: "",
    ATD: "",
    ATA: "",
    ATR: "",
    fuel: "",
  });
  let pilotList = [0, 1, 2, 3, 4, 5];
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    console.log(inputs.pilot0);
    try {
      const res = axios.post(`${API_URL}/flights`, inputs);
    } catch (error) {
      console.log(error);
    }

    //   const pilotToBeSaved = {   //   const pilotToBeSaved = {
    //     name: name,
    //     nip: nip,
    //     position: fc,
    //     rank: posto,
    //   };
    //   try {
    //     const res = await axios.post(`${API_URL}/pilots`, pilotToBeSaved);
    //     setPilotos([...pilotos, res.data]);
    //     onClose();
    //   } catch (error) {
    //     // console.log(error);
    //   }
  };

  return (
    <>
      <Button onClick={onOpen}>Novo Modelo</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleCreateFlight}>
          <ModalContent minWidth={"1300px"}>
            <ModalHeader>Novo Modelo 1M</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Flex gap={"5"} alignSelf={"center"}>
                  <FormControl maxWidth={"100px"}>
                    <FormLabel textAlign={"center"}>Airtask</FormLabel>
                    <Input
                      name="airtask"
                      type="text"
                      value={inputs.airtask}
                      onChange={(e) =>
                        setInputs({ ...inputs, airtask: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"175px"}>
                    <FormLabel textAlign={"center"}>Data</FormLabel>
                    <Input
                      name="date"
                      type="date"
                      value={inputs.date}
                      onChange={(e) =>
                        setInputs({ ...inputs, date: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl ml={"5"} maxWidth={"75px"}>
                    <FormLabel textAlign={"center"}>ATD</FormLabel>
                    <Input
                      name="departure_time"
                      type="time"
                      value={inputs.ATD}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATD: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel textAlign={"center"}>ATA</FormLabel>
                    <Input
                      name="arrival_time"
                      type="time"
                      value={inputs.ATA}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATA: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel textAlign={"center"}>TOTAL</FormLabel>
                    <Input
                      type="time"
                      value={inputs.origin}
                      onChange={(e) =>
                        setInputs({ ...inputs, total: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl ml={"5"} maxWidth={"75px"}>
                    <FormLabel textAlign={"center"}>Origem</FormLabel>
                    <Input
                      name="origin"
                      type="text"
                      value={inputs.origin}
                      onChange={(e) =>
                        setInputs({ ...inputs, origin: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel textAlign={"center"}>Destino</FormLabel>
                    <Input
                      name="destination"
                      type="text"
                      value={inputs.destination}
                      onChange={(e) =>
                        setInputs({ ...inputs, destination: e.target.value })
                      }
                    />
                  </FormControl>
                </Flex>
                <Flex gap={"5"}>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Aterragens</FormLabel>
                    <Input
                      name="aterragens"
                      type="number"
                      value={inputs.ATR}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATR: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Nº Tripulantes</FormLabel>
                    <Input
                      type="number"
                      value={inputs.numberTrip}
                      onChange={(e) =>
                        setInputs({ ...inputs, numberTrip: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>ORM</FormLabel>
                    <Input
                      type="number"
                      value={inputs.ORM}
                      onChange={(e) =>
                        setInputs({ ...inputs, ORM: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>FUEL</FormLabel>
                    <Input
                      placeholder="Kg"
                      type="number"
                      // value={inputs.fuel}
                      onChange={(e) =>
                        setInputs({ ...inputs, fuel: e.target.value })
                      }
                    />
                  </FormControl>
                </Flex>
                <Divider my={8} />
                <Grid
                  // alignItems={"center"}
                  // alignContent={"center"}
                  // alignSelf={"center"}
                  // templateRows="repeat(7, 1fr)"
                  templateColumns="repeat(9, 1fr)"
                >
                  <GridItem textAlign={"center"}>NIP</GridItem>
                  <GridItem textAlign={"center"}>Nome</GridItem>
                  <GridItem textAlign={"center"}>Posição</GridItem>
                  <GridItem textAlign={"center"}>ATR</GridItem>
                  <GridItem textAlign={"center"}>ATN</GridItem>
                  <GridItem textAlign={"center"}>PrecApp</GridItem>
                  <GridItem textAlign={"center"}>NPrecApp</GridItem>
                  <GridItem textAlign={"center"}>Qual1</GridItem>
                  <GridItem textAlign={"center"}>Qual2</GridItem>

                  {pilotList.map((number) => (
                    <PilotInput
                      key={number}
                      inputs={inputs}
                      setInputs={setInputs}
                      pilotNumber={`pilot${number}`}
                    />
                  ))}
                </Grid>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Add
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

export default CreateFlightModal;
