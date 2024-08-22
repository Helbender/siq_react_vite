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
} from "@chakra-ui/react";
import CreateUserModal from "./CreateUserModal";
import { BiTrash } from "react-icons/bi";
import StyledText from "../styledcomponents/StyledText";

function UserDataCard({ user }) {
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
        <Flex align={"left"}>
          <CreateUserModal user={user} />
          <IconButton
            //   onClick={() => handleDeletePilot(user.nip)}
            variant="ghost"
            colorScheme="red"
            size={"lg"}
            icon={<BiTrash />}
          />
        </Flex>
      </CardFooter>
    </Card>
    // <Box
    //   borderWidth={1}
    //   borderRadius="md"
    //   overflow="hidden"
    //   p={4}
    //   mb={35}
    //   //   bg="white"
    //   shadow="md"
    //   maxW="90%"
    // >
    //   <Box mb={2}>
    //     <strong>NIP:</strong> {user.nip}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Name:</strong> {user.name}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Rank:</strong> {user.rank}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Position:</strong> {user.position}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Email:</strong> {user.email}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Admin:</strong> {user.admin ? "Yes" : "No"}
    //   </Box>
    //   <Box mb={2}>
    //     <strong>Squadron:</strong> {user.squadron}
    //   </Box>
    //   <HStack spacing={2} justifyContent="center">
    //     <CreateUserModal edit={true} user={user} />
    //     {/* <IconButton
    //       icon={<FaMailBulk />}
    //       colorScheme="blue"
    //       onClick={() => onEmailClick(user.email)}
    //       aria-label="Send Email"
    //     /> */}
    //   </HStack>
    // </Box>
  );
}

export default UserDataCard;
