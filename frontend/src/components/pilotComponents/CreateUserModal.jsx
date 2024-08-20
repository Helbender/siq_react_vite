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

function CreateUserModal({ pilotos, setPilotos, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState([]);

  const handleInputsChange = async (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    setInputs(() => ({ ...inputs, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputs(() => ({ ...inputs, password: 12345 }));
    try {
      console.log(inputs);
      const res = await axios.post(`/api/pilots`, inputs, {
        headers: { Authorization: "Bearer " + token },
      });
      setPilotos([...pilotos, res.data]);
      onClose();
    } catch (error) {
      console.log(error);
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
                  name="rank"
                  placeholder="Posto"
                  onChange={handleInputsChange}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>NIP</FormLabel>
                <Input
                  name="nip"
                  placeholder="NIP"
                  onChange={handleInputsChange}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  name="position"
                  placeholder="Função a bordo"
                  onChange={handleInputsChange}
                ></Input>
              </FormControl>
            </Flex>
            <FormControl mt={5}>
              <FormLabel flexGrow={"2"}>Nome</FormLabel>
              <Input
                name="name"
                flexGrow={"2"}
                placeholder="Nome"
                onChange={handleInputsChange}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleInputsChange}
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
