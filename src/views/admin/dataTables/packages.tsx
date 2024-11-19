import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  VStack,
  Avatar,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  HStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

// Dummy package data with products
const initialPackages = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Package ${i + 1}`,
  status: i % 2 === 0 ? 'Available' : 'Unavailable',
  idCode: `PKG${100 + i}`,
  eventsCompleted: Math.floor(Math.random() * 100),
  totalUsed: Math.floor(Math.random() * 1000),
  issueHistory: Math.floor(Math.random() * 10),
  capacity: Math.floor(Math.random() * 50) + 50,
  products: [
    { id: `PROD-${i + 1}-A`, name: `Product A-${i + 1}`, quantity: 10 },
    { id: `PROD-${i + 1}-B`, name: `Product B-${i + 1}`, quantity: 5 },
  ],
}));

const packageHistory = [
  { id: '001', details: 'Package Created', status: 'Completed' },
  { id: '002', details: 'First Order Processed', status: 'Completed' },
  { id: '003', details: 'Package Updated', status: 'Pending' },
];

const packageEarnings = {
  totalEarnings: '$2000.00',
  balance: '$5000.00',
  withdrawn: '$3000.00',
};

export default function PackagesDashboard() {
  const [packages, setPackages] = useState(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<any>({
    name: '',
    idCode: '',
    status: 'Available',
    products: [{ id: '', name: '', quantity: 1 }],
  });
  const [updatedPackage, setUpdatedPackage] = useState<any>(null);
  const toast = useToast();

  // Handle Add Package Modal
  const handleAddPackage = () => {
    setNewPackage({
      name: '',
      idCode: '',
      status: 'Available',
      products: [{ id: '', name: '', quantity: 1 }],
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        ...newPackage,
        id: prev.length + 1,
        eventsCompleted: 0,
        totalUsed: 0,
        issueHistory: 0,
        capacity: 50,
      },
    ]);
    setIsAddModalOpen(false);
    toast({
      title: 'Package Added',
      description: 'The new package has been added successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleModifyPackage = () => {
    if (selectedPackage) {
      setUpdatedPackage({ ...selectedPackage });
      setIsModifyModalOpen(true);
    }
  };

  const handleSaveModifiedPackage = () => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === updatedPackage.id ? { ...updatedPackage } : pkg
      )
    );
    setSelectedPackage({ ...updatedPackage });
    setIsModifyModalOpen(false);
    toast({
      title: 'Package Updated',
      description: 'The package details have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemovePackage = () => {
    setPackages((prev) =>
      prev.filter((pkg) => pkg.id !== selectedPackage.id)
    );
    setSelectedPackage(null);
    toast({
      title: 'Package Removed',
      description: 'The package has been removed successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p="20px" bg="gray.50" pt={{ base: '80px', md: '100px' }}>
      <SimpleGrid columns={12} spacing="20px">
        {/* Left Section */}
        <Box
          bg="white"
          p="20px"
          borderRadius="8px"
          shadow="md"
          overflowY="auto"
          maxHeight="600px"
          gridColumn={{ base: 'span 12', md: 'span 3' }}
        >
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="lg" fontWeight="bold">
              All Packages
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<AddIcon />}
              onClick={handleAddPackage}
            >
              Add Package
            </Button>
          </Flex>
          {packages.map((pkg) => (
            <Flex
              key={pkg.id}
              p="10px"
              borderBottom="1px solid"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() => setSelectedPackage(pkg)}
              align="center"
              justify="space-between"
              mb="2"
            >
              <Flex align="center" gap="10px">
                <Avatar name={pkg.name} size="sm" />
                <Box>
                  <Text fontWeight="bold">{pkg.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ID: {pkg.idCode}
                  </Text>
                </Box>
              </Flex>
              <Badge colorScheme={pkg.status === 'Available' ? 'green' : 'red'}>
                {pkg.status}
              </Badge>
            </Flex>
          ))}
        </Box>

        {/* Right Section */}
        <VStack spacing="20px" align="stretch" gridColumn={{ base: 'span 12', md: 'span 9' }}>
          {/* Package Information */}
          <Box bg="white" p="20px" borderRadius="8px" shadow="md">
            <Text fontSize="lg" fontWeight="bold" mb="4">
              Package Information
            </Text>
            {selectedPackage ? (
              <>
                <Flex justify="space-between" align="center" mb="4">
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">
                      {selectedPackage.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      ID: {selectedPackage.idCode}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={
                      selectedPackage.status === 'Available' ? 'green' : 'red'
                    }
                    fontSize="md"
                    px="3"
                    py="1"
                  >
                    {selectedPackage.status}
                  </Badge>
                </Flex>

                <Box mt="20px">
                  <Text fontSize="lg" fontWeight="bold" mb="4">
                    Products
                  </Text>
                  {selectedPackage.products.map((product: any) => (
                    <Flex
                      key={product.id}
                      align="center"
                      justify="space-between"
                      mb="2"
                      p="10px"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      <Text>
                        {product.name} (Quantity: {product.quantity})
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ID: {product.id}
                      </Text>
                    </Flex>
                  ))}
                </Box>

                {/* Buttons */}
                <Flex gap="4" mt="20px">
                  <Button colorScheme="blue" onClick={handleModifyPackage}>
                    Modify Package
                  </Button>
                  <Button colorScheme="red" onClick={handleRemovePackage}>
                    Remove Package
                  </Button>
                </Flex>
              </>
            ) : (
              <Text>Select a package to view details</Text>
            )}
          </Box>

          {/* Bottom Two Boxes */}
          <SimpleGrid columns={2} spacing="20px">
            {/* Package History */}
            <Box bg="white" p="20px" borderRadius="8px" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Package History
              </Text>
              {selectedPackage ? (
                packageHistory.map((history) => (
                  <Flex
                    key={history.id}
                    justify="space-between"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    pb="2"
                    mb="2"
                  >
                    <Text>{history.details}</Text>
                    <Badge
                      colorScheme={
                        history.status === 'Completed' ? 'green' : 'orange'
                      }
                    >
                      {history.status}
                    </Badge>
                  </Flex>
                ))
              ) : (
                <Text>Select a package to view history</Text>
              )}
            </Box>

            {/* Package Earnings */}
            <Box bg="white" p="20px" borderRadius="8px" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Package Earnings
              </Text>
              {selectedPackage ? (
                <>
                  <Text>Total Earnings: {packageEarnings.totalEarnings}</Text>
                  <Text>Balance: {packageEarnings.balance}</Text>
                  <Text>Withdrawn: {packageEarnings.withdrawn}</Text>
                </>
              ) : (
                <Text>Select a package to view earnings</Text>
              )}
            </Box>
          </SimpleGrid>
        </VStack>
      </SimpleGrid>

      {/* Add Package Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Package Name"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage((prev:any) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Package ID Code"
                value={newPackage.idCode}
                onChange={(e) =>
                  setNewPackage((prev:any) => ({
                    ...prev,
                    idCode: e.target.value,
                  }))
                }
              />
              <Text fontSize="lg" fontWeight="bold" mt="4">
                Products
              </Text>
              {newPackage.products.map((product:any, index:any) => (
                <HStack key={index} spacing={4} width="100%">
                  <Input
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) =>
                      setNewPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, name: e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Product ID"
                    value={product.id}
                    onChange={(e) =>
                      setNewPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, id: e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      setNewPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, quantity: +e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() =>
                      setNewPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.filter((_:any, i:any) => i !== index),
                      }))
                    }
                    aria-label="Remove Product"
                  />
                </HStack>
              ))}
              <Button
                size="sm"
                leftIcon={<AddIcon />}
                onClick={() =>
                  setNewPackage((prev:any) => ({
                    ...prev,
                    products: [...prev.products, { id: '', name: '', quantity: 1 }],
                  }))
                }
                colorScheme="green"
              >
                Add Product
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveNewPackage}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modify Package Modal */}
      <Modal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Package Name"
                value={updatedPackage?.name || ''}
                onChange={(e) =>
                  setUpdatedPackage((prev:any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Package ID Code"
                value={updatedPackage?.idCode || ''}
                onChange={(e) =>
                  setUpdatedPackage((prev:any) => ({
                    ...prev,
                    idCode: e.target.value,
                  }))
                }
              />
              <Text fontSize="lg" fontWeight="bold" mt="4">
                Products
              </Text>
              {updatedPackage?.products.map((product:any, index:any) => (
                <HStack key={index} spacing={4} width="100%">
                  <Input
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) =>
                      setUpdatedPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, name: e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Product ID"
                    value={product.id}
                    onChange={(e) =>
                      setUpdatedPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, id: e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      setUpdatedPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.map((p:any, i:any) =>
                          i === index ? { ...p, quantity: +e.target.value } : p
                        ),
                      }))
                    }
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() =>
                      setUpdatedPackage((prev:any) => ({
                        ...prev,
                        products: prev.products.filter((_:any, i:any) => i !== index),
                      }))
                    }
                    aria-label="Remove Product"
                  />
                </HStack>
              ))}
              <Button
                size="sm"
                leftIcon={<AddIcon />}
                onClick={() =>
                  setUpdatedPackage((prev:any) => ({
                    ...prev,
                    products: [...prev.products, { id: '', name: '', quantity: 1 }],
                  }))
                }
                colorScheme="green"
              >
                Add Product
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveModifiedPackage}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsModifyModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
