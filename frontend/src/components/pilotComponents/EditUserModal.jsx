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
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "axios";

function EditUserModal({ piloto, setPilotos }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posto, setPosto] = useState(piloto.rank);
  const [name, setName] = useState(piloto.name);
  const [fc, setfc] = useState(piloto.position);

  const handleEditUser = async (e) => {
    e.preventDefault();
    const UserToBeEdited = {
      name: name,
      position: fc,
      rank: posto,
    };
    try {
      const res = await axios.patch(
        `/api/pilots/${piloto.nip}`,
        UserToBeEdited,
      );
      console.log(res.data);
      setPilotos((prevUsers) =>
        prevUsers.map((u) => (u.nip === piloto.nip ? res.data : u)),
      );
      console.log("teste2");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <IconButton
        onClick={onOpen}
        variant="ghost"
        size={"lg"}
        icon={<CiEdit />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${piloto.rank} ${piloto.name}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"row"} gap={"4"}>
              <FormControl>
                <FormLabel>Posto</FormLabel>
                <Input
                  value={posto}
                  onChange={(e) => {
                    setPosto(e.target.value);
                    // console.log(e.target.value);
                  }}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  value={fc}
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
                value={name}
                flexGrow={"2"}
                onChange={(e) => {
                  setName(e.target.value);
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
              onClick={handleEditUser}
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

export default EditUserModal;
