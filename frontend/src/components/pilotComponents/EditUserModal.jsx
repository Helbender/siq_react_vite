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
import { useContext, useState } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

function EditUserModal({ piloto }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, setPilotos } = useContext(AuthContext);
  const [inputs, setInputs] = useState(piloto);

  const handleInputsChange = async (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    setInputs(() => ({ ...inputs, [name]: value }));
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(`/api/pilots/${piloto.nip}`, inputs, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(res.data);
      setPilotos((prevUsers) =>
        prevUsers.map((u) => (u.nip === piloto.nip ? res.data : u)),
      );
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
                  name="rank"
                  value={inputs.rank}
                  onChange={handleInputsChange}
                ></Input>
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  value={inputs.position}
                  onChange={handleInputsChange}
                ></Input>
              </FormControl>
            </Flex>
            <FormControl mt={5}>
              <FormLabel flexGrow={"2"}>Nome</FormLabel>
              <Input
                name="name"
                value={inputs.name}
                flexGrow={"2"}
                onChange={handleInputsChange}
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
