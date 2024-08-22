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
  VStack,
  HStack,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaEdit, FaPlus, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '../../Context';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <Container maxW="container.lg" py={6} mb={35}>
      <HStack spacing={4} mb={10} align="center">
        <Button colorScheme="teal" leftIcon={<FaPlus />} onClick={() => { setIsAdding(true); setSelectedUser(null); onOpen(); }}>
          Add New Pilot
        </Button>
        <Spacer />
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
              <Th>Actions</Th>
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
                  <HStack spacing={2}>
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme="yellow"
                      onClick={() => handleEditClick(user)}
                      aria-label="Edit User"
                    />
                    <IconButton
                      icon={<FaEnvelope />}
                      colorScheme="blue"
                      onClick={() => handleSendEmailClick(user.email)}
                      aria-label="Send Password Recovery Email"
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
            <Box
              key={user.nip}
              borderWidth={1}
              borderRadius="md"
              overflow="hidden"
              p={4}
              bg="white"
              shadow="md"
              maxW="90%"
              mb={35}  // Add margin bottom to prevent sticking to footer
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
              <HStack spacing={2} mt={4}>
                <Button
                  colorScheme="yellow"
                  leftIcon={<FaEdit />}
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </Button>
                <IconButton
                  icon={<FaEnvelope />}
                  colorScheme="blue"
                  onClick={() => handleSendEmailClick(user.email)}
                  aria-label="Send Password Recovery Email"
                />
              </HStack>
            </Box>
          ))}
        </Box>
      )}
      <Modal isOpen={isEditing || isAdding || isSendingEmail} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isSendingEmail ? 'Send Password Recovery Email' : isEditing ? 'Edit User' : 'Add New User'}
          </ModalHeader>
          <ModalBody>
            {isSendingEmail ? (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={emailToSend}
                    onChange={(e) => setEmailToSend(e.target.value)}
                  />
                </FormControl>
              </VStack>
            ) : isEditing ? (
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
            ) : (
              <Box>
                {/* Additional form fields for adding a new user */}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            {isSendingEmail ? (
              <>
                <Button colorScheme="blue" onClick={handleSendEmail}>Send</Button>
                <Button ml={3} onClick={onClose}>Cancel</Button>
              </>
            ) : isEditing ? (
              <>
                <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                <Button ml={3} onClick={onClose}>Cancel</Button>
              </>
            ) : isAdding ? (
              <>
                <Button colorScheme="blue" onClick={handleAdd}>Add</Button>
                <Button ml={3} onClick={onClose}>Cancel</Button>
              </>
            ) : (
              <Button onClick={onClose}>Close</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
