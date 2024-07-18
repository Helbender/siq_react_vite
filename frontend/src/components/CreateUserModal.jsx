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
import React from "react";

function CreateUserModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posto, setPosto] = React.useState("");
  const [nip, setnip] = React.useState("");
  const [nome, setnome] = React.useState("");
  const [fc, setfc] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(posto, nip, nome, fc);
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
                    console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>NIP</FormLabel>
                <Input
                  placeholder="NIP"
                  onChange={(e) => {
                    setnip(e.target.value);
                    console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  placeholder="Função a bordo"
                  onChange={(e) => {
                    setfc(e.target.value);
                    console.log(e.target.value);
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
                  setnome(e.target.value);
                  console.log(e.target.value);
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
