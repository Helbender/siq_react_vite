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
import { useState, useEffect } from "react";
import PilotInput from "./PilotInput";
import axios from "axios";

function CreateFlightModal({ flights, setFlights }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pilotos, setPilotos] = useState([]);
  let today = new Date();
  const [inputs, setInputs] = useState({
    airtask: "",
    flightType: "",
    flightAction: "",
    date: `${today.toISOString().substring(0, 10)}`,
    origin: "",
    destination: "",
    ATD: "",
    ATA: "",
    ATE: "",
    tailNumber: "",
    totalLandings: "",
    passengers: "",
    doe: "",
    cargo: "",
    numberOfCrew: "",
    orm: "",
    fuel: "",
  });

  let pilotList = [0, 1, 2, 3, 4, 5];

  const handleCreateFlight = async (e) => {
    e.preventDefault();
    let data = inputs;
    for (let i = 0; i < 6; i++) {
      if (Object.hasOwn(inputs, `pilot${i}`)) {
        data.flight_pilots = [inputs[`pilot${i}`]];
        delete data[`pilot${i}`];
      }
    }
    try {
      const res = axios.post(`/api/flights`, data);
      setFlights([...flights, data]);
    } catch (error) {
      console.log(error);
    }
  };
  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/pilots`);
      // console.log(res);
      setPilotos(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedPilots();
  }, []);

  return (
    <>
      <Button onClick={onOpen}>Novo Modelo</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleCreateFlight}>
          <ModalContent minWidth={"1200px"}>
            <ModalHeader>Novo Modelo 1M</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Flex gap={"5"} alignSelf={"center"}>
                  <FormControl maxWidth={"120px"}>
                    <FormLabel textAlign={"center"}>Airtask</FormLabel>
                    <Input
                      name="airtask"
                      type="text"
                      isRequired
                      value={inputs.airtask}
                      onChange={(e) =>
                        setInputs({ ...inputs, airtask: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Modalidade</FormLabel>
                    <Input
                      name="modalidade"
                      type="text"
                      isRequired
                      value={inputs.flightType}
                      onChange={(e) =>
                        setInputs({ ...inputs, flightType: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Acção</FormLabel>
                    <Input
                      name="action"
                      type="text"
                      isRequired
                      value={inputs.flightAction}
                      onChange={(e) =>
                        setInputs({ ...inputs, flightAction: e.target.value })
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
                  <FormControl ml={"5"} maxWidth={"90px"}>
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
                  <FormControl maxWidth={"90px"}>
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
                  <FormControl maxWidth={"90px"}>
                    <FormLabel textAlign={"center"}>TOTAL</FormLabel>
                    <Input
                      type="time"
                      value={inputs.ATE}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATE: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl ml={"5"} maxWidth={"90px"}>
                    <FormLabel textAlign={"center"}>Origem</FormLabel>
                    <Input
                      name="origin"
                      type="text"
                      value={inputs.origin}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          origin: e.target.value.toUpperCase(),
                        })
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
                        setInputs({
                          ...inputs,
                          destination: e.target.value.toUpperCase(),
                        })
                      }
                      // onInput={(e) =>
                      //   (e.target.value = ("" + e.target.value).toUpperCase())
                      // }
                    />
                  </FormControl>
                </Flex>
                <Flex mt="5" gap={"5"}>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Nº Cauda</FormLabel>
                    <Input
                      name="tailNumber"
                      type="number"
                      isRequired
                      value={inputs.tailNumber}
                      onChange={(e) =>
                        setInputs({ ...inputs, tailNumber: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Aterragens</FormLabel>
                    <Input
                      name="aterragens"
                      type="number"
                      value={inputs.totalLandings}
                      onChange={(e) =>
                        setInputs({ ...inputs, totalLandings: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Nº Tripulantes</FormLabel>
                    <Input
                      type="number"
                      value={inputs.numberOfCrew}
                      onChange={(e) =>
                        setInputs({ ...inputs, numberOfCrew: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>PAX</FormLabel>
                    <Input
                      name="passengers"
                      type="number"
                      value={inputs.passengers}
                      onChange={(e) =>
                        setInputs({ ...inputs, passengers: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Doentes</FormLabel>
                    <Input
                      name="doe"
                      type="number"
                      value={inputs.doe}
                      onChange={(e) =>
                        setInputs({ ...inputs, doe: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>Carga</FormLabel>
                    <Input
                      name="cargo"
                      type="number"
                      value={inputs.cargo}
                      onChange={(e) =>
                        setInputs({ ...inputs, cargo: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>ORM</FormLabel>
                    <Input
                      type="number"
                      value={inputs.orm}
                      onChange={(e) =>
                        setInputs({ ...inputs, orm: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel textAlign={"center"}>FUEL</FormLabel>
                    <Input
                      placeholder="Kg"
                      type="number"
                      value={inputs.fuel}
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
                      pilotos={pilotos}
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
