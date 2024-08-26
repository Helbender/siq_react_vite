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
  Text,
  VStack,
  HStack,
  Switch,
  useToast,
  // Stack,
} from "@chakra-ui/react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext";
import { BiTrash } from "react-icons/bi";

function CreateUserModal({ edit, add, isDelete, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [inputs, setInputs] = useState(user);
  const { token, pilotos, setPilotos } = useContext(AuthContext);

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
      toast({ title: "User created successfully", status: "success" });

      setPilotos([...pilotos, res.data]);
      onClose();
    } catch (error) {
      toast({ title: "Error updating user", status: "error" });
      console.error("Error updating user:", error);
    }
  };
  const handleEditUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(`/api/pilots/${user.nip}`, inputs, {
        headers: { Authorization: "Bearer " + token },
      });
      toast({ title: "User updated successfully", status: "success" });

      console.log(res.data);
      setPilotos((prevUsers) =>
        prevUsers.map((u) => (u.nip === user.nip ? res.data : u)),
      );
      onClose();
    } catch (error) {
      toast({ title: "Error adding user", status: "error" });
      console.error("Error adding user:", error);
    }
  };

  const handleDeletePilot = async () => {
    try {
      const res = await axios.delete(`/api/pilots/${user.nip}`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(res);
      if (res.data?.deleted_id) {
        setPilotos(pilotos.filter((piloto) => piloto.nip != user.nip));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {add ? (
        <Button leftIcon={<FaPlus />} onClick={onOpen}>
          Criar Utilizador
        </Button>
      ) : edit ? (
        <IconButton
          icon={<FaEdit />}
          colorScheme="yellow"
          onClick={onOpen}
          aria-label="Edit User"
        />
      ) : (
        <IconButton
          icon={<BiTrash />}
          colorScheme="red"
          onClick={onOpen}
          aria-label="Delete User"
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {add ? (
            <ModalHeader>Novo Utilizador</ModalHeader>
          ) : edit ? (
            <ModalHeader>Editar Utilizador</ModalHeader>
          ) : (
            <ModalHeader>Apagar Utilizador</ModalHeader>
          )}
          <ModalCloseButton />
          {isDelete ? (
            <Text textAlign={"center"}>Tem a certeza?</Text>
          ) : (
            <ModalBody>
              <Flex flexDirection={"row"} gap={"4"}>
                <FormControl>
                  <FormLabel>Posto</FormLabel>
                  <Input
                    value={inputs?.rank}
                    name="rank"
                    placeholder="Posto"
                    onChange={handleInputsChange}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>NIP</FormLabel>
                  <Input
                    value={inputs?.nip}
                    name="nip"
                    placeholder="NIP"
                    onChange={handleInputsChange}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Função</FormLabel>
                  <Input
                    value={inputs?.position}
                    name="position"
                    placeholder="Função a bordo"
                    onChange={handleInputsChange}
                  ></Input>
                </FormControl>
              </Flex>
              <VStack mt={5} spacing={4} align="stretch">
                <FormControl>
                  <FormLabel flexGrow={"2"}>Nome</FormLabel>
                  <Input
                    value={inputs?.name}
                    name="name"
                    flexGrow={"2"}
                    placeholder="Nome"
                    onChange={handleInputsChange}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={inputs?.email}
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleInputsChange}
                  ></Input>
                </FormControl>
                <HStack>
                  <FormControl align={"center"}>
                    <FormLabel textAlign={"center"}>Admin</FormLabel>
                    <Switch
                      name="admin"
                      isChecked={inputs?.admin}
                      onChange={(e) => {
                        setInputs(() => ({
                          ...inputs,
                          ["admin"]: e.target.checked,
                        }));
                        console.log(inputs);
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Esquadra</FormLabel>
                    <Input
                      value={inputs?.squadron}
                      name="squadron"
                      type="text"
                      placeholder="Esquadra"
                      onChange={handleInputsChange}
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </ModalBody>
          )}
          <ModalFooter>
            {isDelete ? (
              <Button
                colorScheme="red"
                mr={3}
                type="submit"
                onClick={handleDeletePilot}
              >
                Apagar
              </Button>
            ) : (
              <Button
                colorScheme="green"
                mr={3}
                type="submit"
                onClick={edit ? handleEditUser : handleSubmit}
              >
                Save
              </Button>
            )}
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
