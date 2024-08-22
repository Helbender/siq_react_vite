/* eslint-disable react/prop-types */
import {
  Box,
  HStack,
  Card,
  CardHeader,
  Flex,
  Circle,
  Heading,
  IconButton,
  useColorModeValue,
  CardBody,
  CardFooter,
  Text,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import CreateUserModal from "./CreateUserModal";
import { BiTrash } from "react-icons/bi";
import StyledText from "../styledcomponents/StyledText";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";

function UserDataCard({ user }) {
  const { token, pilotos, setPilotos } = useContext(AuthContext);
  const handleDeletePilot = async (nip) => {
    try {
      const res = await axios.delete(`/api/pilots/${nip}`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(res);
      if (res.data?.deleted_id) {
        setPilotos(pilotos.filter((piloto) => piloto.nip != nip));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card bg={useColorModeValue("gray.200", "gray.700")} boxShadow={"xl"}>
      <CardHeader>
        <Flex gap={4}>
          <Flex flex={"1"} flexDirection={"row"} align="center" gap={"5"}>
            <Circle
              bg={user.position === "PC" ? "blue.500" : "green"}
              size="40px"
              boxShadow="dark-lg"
              pt={"1"}
            >
              {user.position}
            </Circle>
            <Heading size="sm">{`${user.rank} ${user.name}`}</Heading>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} alignItems={"left"}>
          <StyledText query={"NIP:"} text={`NIP:  ${user.nip}`} />
          <StyledText query={"Email:"} text={`Email:  ${user.email}`} />
          <StyledText
            query={"Esquadra:"}
            text={`Esquadra:  ${user.squadron}`}
          />
          <StyledText
            query={"Admin:"}
            text={`Admin:  ${user.admin ? "Sim" : "Não"}`}
          />
        </VStack>
      </CardBody>
      <CardFooter>
        <Flex gap={5}>
          <Spacer />
          <CreateUserModal edit={true} user={user} />
          <CreateUserModal isDelete={true} user={user} />
        </Flex>
      </CardFooter>
    </Card>
  );
}

export default UserDataCard;
