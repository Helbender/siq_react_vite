import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Spacer,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaMailBulk } from 'react-icons/fa';
import { AuthContext } from '../../Context';
import { useSendEmail } from '../loginComponents/useSendEmail'; // Adjust the path as necessary

const UserCard = ({ user, onEditClick, onDeleteClick, onEmailClick }) => (
  <Box
    borderWidth={1}
    borderRadius="md"
    overflow="hidden"
    p={4}
    mb={35}
    bg="white"
    shadow="md"
    maxW="90%"
  >
    <Box mb={2}>
      <strong>NIP:</strong> {user.nip}
    </Box>
    <Box mb={2}>
      <strong>Name:</strong> {user.name}
    </Box>
    <Box mb={2}>
      <strong>Rank:</strong> {user.rank}
    </Box>
    <Box mb={2}>
      <strong>Position:</strong> {user.position}
    </Box>
    <Box mb={2}>
      <strong>Email:</strong> {user.email}
    </Box>
    <Box mb={2}>
      <strong>Admin:</strong> {user.admin ? 'Yes' : 'No'}
    </Box>
    <Box mb={2}>
      <strong>Squadron:</strong> {user.squadron}
    </Box>
    <HStack spacing={2} justifyContent="center">
      <IconButton
        icon={<FaEdit />}
        colorScheme="yellow"
        onClick={() => onEditClick(user)}
        aria-label="Edit User"
      />
      <IconButton
        icon={<FaMailBulk />}
        colorScheme="blue"
        onClick={() => onEmailClick(user.email)}
        aria-label="Send Email"
      />
    </HStack>
  </Box>
);

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const sendEmail = useSendEmail(); // Initialize the hook

  // Fetch pilot data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/pilots', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Pilots fetched:", response.data);
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching pilots:", error);
      }
    };

    fetchData();
  }, [token]);

  // Filter users based on search term
  useEffect(() => {
    const results = users.filter(user => 
      [user.nip, user.name, user.rank, user.position, user.email, user.admin ? 'Yes' : 'No', user.squadron]
        .map(field => (field ? field.toString().toLowerCase() : ''))
        .some(field => field.includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);
  
  // Handle Save
  const handleSave = () => {
    axios.put(`/api/pilots/${selectedUser.nip}`, selectedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      toast({ title: 'User updated successfully', status: 'success' });
      onClose();
      setIsEditing(false);
      setSelectedUser(null);
      // Refetch users
      axios.get('/api/pilots', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUsers(response.data || []))
      .catch(error => console.error('Error refetching users:', error));
    })
    .catch(error => {
      toast({ title: 'Error updating user', status: 'error' });
      console.error('Error updating user:', error);
    });
  };

  // Handle Add
  const handleAdd = () => {
    axios.post('/api/pilots', selectedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      toast({ title: 'User added successfully', status: 'success' });
      onClose();
      setIsAdding(false);
      setSelectedUser(null);
      // Refetch users
      axios.get('/api/pilots', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUsers(response.data || []))
      .catch(error => console.error('Error refetching users:', error));
    })
    .catch(error => {
      toast({ title: 'Error adding user', status: 'error' });
      console.error('Error adding user:', error);
    });
  };
  
  const handleDelete = () => {
    axios.delete(`/api/pilots/${userToDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      toast({ title: 'User deleted successfully', status: 'success' });
      setUsers(users.filter(user => user.nip !== userToDelete));
      setIsDeleting(false);
      setUserToDelete(null);
      onClose(); // This should close the modal
    })
    .catch(error => {
      toast({ title: 'Error deleting user', status: 'error' });
      console.error('Error deleting user:', error);
    });
  };
  

  // Open modal for editing
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    onOpen();
  };

  // Open confirmation modal for delete
  const handleDeleteClick = (userNip) => {
    setUserToDelete(userNip);
    setIsDeleting(true);
    onOpen();
  };

  // Determine if the screen size is large enough for a table
  const displayAsTable = useBreakpointValue({ base: false, xl: true });

  const handleEmailClick = async (email) => {
    try {
      const success = await sendEmail(email, `/api/recover/${email}`);
      if (success) {
        toast({
          title: "Email sent.",
          description: "Please check your email.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Error.",
          description: "Failed to send the email. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error.",
        description: "Failed to send the email. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Container maxW="container.lg" py={6} mb={35}>
      <HStack spacing={4} mb={10} align="center">
        <Button colorScheme="teal" leftIcon={<FaPlus />} onClick={() => { setIsAdding(true); setSelectedUser(null); onOpen(); }}>
          Add New Pilot
        </Button>
        <Spacer />e
        <Input 
          placeholder="Search..."
          value={searchTerm}
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
            {filteredUsers.map(user => (
              <Tr key={user.nip}>
                <Td>{user.nip}</Td>
                <Td>{user.name}</Td>
                <Td>{user.rank}</Td>
                <Td>{user.position}</Td>
                <Td>{user.email}</Td>
                <Td>{user.admin ? 'Yes' : 'No'}</Td>
                <Td>{user.squadron}</Td>
                <Td>
                  <HStack spacing={2} align="center">
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme="yellow"
                      onClick={() => handleDeleteUser(user)}
                      aria-label="Edit User"
                    />
                    <IconButton
                      icon={<FaMailBulk />}
                      colorScheme="blue"
                      onClick={() => handleEmailClick(user.email)}
                      aria-label="Email User"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box>
          {filteredUsers.map(user => (
            <UserCard
              key={user.nip}
              user={user}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onCloseClick={handleDeleteClick}
              onEmailClick={handleEmailClick}
            />
          ))}
        </Box>
      )}
      <Modal isOpen={isEditing || isAdding || isDeleting} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit User' : isAdding ? 'Add New User' : 'Delete User'}</ModalHeader>
          <ModalBody>
            {isDeleting ? (
              <Box>
                Are you sure you want to delete this user?
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>NIP</FormLabel>
                  <Input
                    value={selectedUser?.nip || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, nip: e.target.value })}
                    isReadOnly={isEditing}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={selectedUser?.name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Rank</FormLabel>
                  <Input
                    value={selectedUser?.rank || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, rank: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Position</FormLabel>
                  <Input
                    value={selectedUser?.position || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, position: e.target.value })}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={selectedUser?.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Admin</FormLabel>
                  <Select
                    value={selectedUser?.admin ? 'Yes' : 'No'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, admin: e.target.value === 'Yes' })}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Squadron</FormLabel>
                  <Input
                    value={selectedUser?.squadron || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, squadron: e.target.value })}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {isDeleting ? (
              <>
                <Button colorScheme="red" onClick={handle}>Delete</Button>
                <Button ml={3} onClick={onClose}>Cancel</Button>
              </>
            ) : (
              <>
                <Button colorScheme="blue" onClick={isEditing ? handleSave : handleAdd}>{isEditing ? 'Save' : 'Add'}</Button>
                <Button ml={3} onClick={onClose}>Cancel</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
