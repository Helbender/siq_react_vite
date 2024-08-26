import { useContext, useState, useEffect } from "react";
import {
  Container,
  HStack,
  Input,
  Spacer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  useBreakpointValue,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../../Contexts/AuthContext";
import CreateUserModal from "../pilotComponents/CreateUserModal";
import { FaMailBulk } from "react-icons/fa";
import UserDataCard from "./UserDataCard";
import { useSendEmail } from "../../Functions/useSendEmail";

function UserManagementPage() {
  const { pilotos, setPilotos } = useContext(AuthContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const displayAsTable = useBreakpointValue({ base: false, xl: true });
  const sendEmail = useSendEmail();
  const toast = useToast();
  // Filter users based on search term
  useEffect(() => {
    const results = pilotos.filter((user) =>
      [
        user.nip,
        user.name,
        user.rank,
        user.position,
        user.email,
        user.admin ? "Yes" : "No",
        user.squadron,
      ]
        .map((field) => (field ? field.toString().toLowerCase() : ""))
        .some((field) => field.includes(searchTerm.toLowerCase())),
    );
    setFilteredUsers(results);
  }, [searchTerm, pilotos]);
  return (
    <Container maxW="container.lg" py={6} mb={35}>
      <HStack spacing={4} mb={10} align={"center"}>
        <CreateUserModal add={true} />

        <Spacer />
        <Input
          placeholder="Search..."
          // value={searchTerm}
          maxWidth={200}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="md"
          flex="1"
        />
      </HStack>
      {displayAsTable ? (
        <Table variant="simple" mt={4} overflowX="auto">
          <Thead>
            <Tr>
              <Th>NIP</Th>
              <Th>Name</Th>
              <Th>Rank</Th>
              <Th>Position</Th>
              <Th>Email</Th>
              <Th>Admin</Th>
              <Th>Squadron</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.nip}>
                <Td>{user.nip}</Td>
                <Td>{user.name}</Td>
                <Td>{user.rank}</Td>
                <Td>{user.position}</Td>
                <Td>{user.email}</Td>
                <Td>{user.admin ? "Yes" : "No"}</Td>
                <Td>{user.squadron}</Td>
                <Td>
                  <HStack spacing={2} align="center">
                    <CreateUserModal edit={true} user={user} />
                    <IconButton
                      icon={<FaMailBulk />}
                      colorScheme="blue"
                      onClick={() => {
                        toast({
                          title: "Sending Email",
                          description: "Wait while we send the Email",
                          status: "info",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                        });
                        sendEmail(user.email, `/api/recover/${user.email}`);
                      }}
                      aria-label="Email User"
                    />
                    <CreateUserModal isDelete={true} user={user} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(3,1fr)",
          }}
          gap={5}
          mt="8"
        >
          {filteredUsers.map((user) => (
            <UserDataCard m={5} key={user.nip} user={user} />
          ))}
        </Grid>
      )}{" "}
    </Container>
  );
}

export default UserManagementPage;
