import React, { useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  VStack,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

// Dummy User Data
const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    contact: '+1-123-456-7890',
    orders: [
      {
        id: 'P001',
        name: 'Product1',
        quantity: 2,
        review: 'Great Product',
      },
      {
        id: 'P002',
        name: 'Package6',
        quantity: 1,
        review: 'Comfortable to use.',
      },
    ],
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    contact: '+1-987-654-3210',
    orders: [
      {
        id: 'P003',
        name: 'Package1',
        quantity: 1,
        review: 'Great Sound.',
      },
      {
        id: 'P004',
        name: 'Package4',
        quantity: 3,
        review: 'Issue with plugs.',
      },
    ],
    rating: 4.5,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState<number | null>(
    null
  );
  const toast = useToast();

  // Handle viewing user details
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    onOpen();
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: any) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setDeleteConfirmOpen(null);
    toast({
      title: 'User Deleted',
      description: 'The user has been successfully removed.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p="20px" pt={{ base: '130px', md: '100px' }} bg="gray.50" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        User Management
      </Text>

      {/* User Table */}
      <TableContainer bg="white" borderRadius="8px" shadow="md" p="20px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Contact</Th>
              <Th>Orders</Th>
              <Th>Rating</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <HStack>
                    <Avatar src={user.profilePicture} name={user.name} />
                    <VStack align="start" spacing="0">
                      <Text fontWeight="bold">{user.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        ID: {user.id}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Text>{user.email}</Text>
                </Td>
                <Td>
                  <Text>{user.contact}</Text>
                </Td>
                <Td>
                  <Badge colorScheme="blue">{user.orders.length} Orders</Badge>
                </Td>
                <Td>
                  <Badge colorScheme="green">{user.rating} ⭐</Badge>
                </Td>
                <Td>
                  <Flex gap="2">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => setDeleteConfirmOpen(user.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* View User Modal */}
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* User Information */}
              <HStack mb="4">
                <Avatar
                  src={selectedUser.profilePicture}
                  name={selectedUser.name}
                  size="lg"
                />
                <VStack align="start">
                  <Text fontWeight="bold">{selectedUser.name}</Text>
                  <Text>{selectedUser.email}</Text>
                  <Text>{selectedUser.contact}</Text>
                </VStack>
              </HStack>

              {/* Orders */}
              <Text fontSize="lg" fontWeight="bold" mt="4" mb="2">
                Orders
              </Text>
              {selectedUser.orders.length > 0 ? (
                <VStack align="start" spacing="4">
                  {selectedUser.orders.map((order: any, index: any) => (
                    <Box
                      key={index}
                      p="10px"
                      borderRadius="8px"
                      border="1px solid"
                      borderColor="gray.200"
                      width="100%"
                    >
                      <Flex justify="space-between">
                        <Text fontWeight="bold">{order.name}</Text>
                        <Text>x{order.quantity}</Text>
                      </Flex>
                      <Text fontSize="sm" mt="2">
                        Review: {order.review || 'No review provided.'}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text>No orders available.</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <Modal isOpen={true} onClose={() => setDeleteConfirmOpen(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this user?</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr="3"
                onClick={() => handleDeleteUser(isDeleteConfirmOpen)}
              >
                Yes, Delete
              </Button>
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmOpen(null)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
