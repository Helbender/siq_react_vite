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
  // Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

function CreateUserModal({ pilotos, setPilotos }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posto, setPosto] = useState("");
  const [nip, setnip] = useState("");
  const [name, setname] = useState("");
  const [fc, setfc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pilotToBeSaved = {
      name: name,
      nip: nip,
      position: fc,
      rank: posto,
    };
    try {
      const res = await axios.post(`${API_URL}/pilots`, pilotToBeSaved);

      setPilotos([...pilotos, res.data]);
      onClose();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Criar Piloto</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Piloto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"row"} gap={"4"}>
              <FormControl>
                <FormLabel>Posto</FormLabel>
                <Input
                  placeholder="Posto"
                  onChange={(e) => {
                    setPosto(e.target.value);
                    // console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>NIP</FormLabel>
                <Input
                  placeholder="NIP"
                  onChange={(e) => {
                    setnip(e.target.value);
                    // console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  placeholder="Função a bordo"
                  onChange={(e) => {
                    setfc(e.target.value);
                    // console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
            </Flex>
            <FormControl mt={5}>
              <FormLabel flexGrow={"2"}>Nome</FormLabel>
              <Input
                flexGrow={"2"}
                placeholder="Nome"
                onChange={(e) => {
                  setname(e.target.value);
                  // console.log(e.target.value);
                }}
              ></Input>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateUserModal;
