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
  // Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import Teste from "./Teste";

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
    pilots: [{ nip: 1 }],
  });
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    console.log(inputs);
    //   const pilotToBeSaved = {
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
          <ModalContent maxHeight={"800px"} maxWidth={"1000px"}>
            <ModalHeader>Novo Modelo 1M</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Flex gap={"5"} alignSelf={"center"}>
                  <FormControl maxWidth={"100px"}>
                    <FormLabel>Airtask</FormLabel>
                    <Input
                      type="text"
                      value={inputs.airtask}
                      onChange={(e) =>
                        setInputs({ ...inputs, airtask: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"175px"}>
                    <FormLabel>Data</FormLabel>
                    <Input
                      type="date"
                      value={inputs.date}
                      onChange={(e) =>
                        setInputs({ ...inputs, date: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl ml={"5"} maxWidth={"75px"}>
                    <FormLabel>ATD</FormLabel>
                    <Input
                      type="time"
                      value={inputs.ATD}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATD: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel>ATA</FormLabel>
                    <Input
                      type="time"
                      value={inputs.ATA}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATA: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel>TOTAL</FormLabel>
                    <Input
                      type="time"
                      value={inputs.origin}
                      onChange={(e) =>
                        setInputs({ ...inputs, origin: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl ml={"5"} maxWidth={"75px"}>
                    <FormLabel>Origem</FormLabel>
                    <Input
                      type="text"
                      value={inputs.origin}
                      onChange={(e) =>
                        setInputs({ ...inputs, origin: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl maxWidth={"75px"}>
                    <FormLabel>Destino</FormLabel>
                    <Input
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
                    <FormLabel>Aterragens</FormLabel>
                    <Input
                      type="number"
                      value={inputs.ATR}
                      onChange={(e) =>
                        setInputs({ ...inputs, ATR: e.target.value })
                      }
                    />
                  </FormControl>{" "}
                  <FormControl>
                    <FormLabel>Nº Tripulantes</FormLabel>
                    <Input
                      type="number"
                      value={inputs.numberTrip}
                      onChange={(e) =>
                        setInputs({ ...inputs, numberTrip: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ORM</FormLabel>
                    <Input
                      type="number"
                      value={inputs.ORM}
                      onChange={(e) =>
                        setInputs({ ...inputs, ORM: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FUEL</FormLabel>
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
                <Flex>
                  <Teste inputs={inputs} setInputs={setInputs} />
                </Flex>
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
