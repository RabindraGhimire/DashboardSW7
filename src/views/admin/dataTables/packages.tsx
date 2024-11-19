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
  Grid,
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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

// Dummy package data with products
const packages = Array.from({ length: 15 }, (_, i) => ({
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
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState<any[]>([]);

  const handleModifyPackage = () => {
    if (selectedPackage) {
      setUpdatedProducts([...selectedPackage.products]);
      setIsModalOpen(true);
    }
  };

  const handleAddProduct = () => {
    setUpdatedProducts([
      ...updatedProducts,
      { id: '', name: '', quantity: 1 }, // New product template
    ]);
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updated = [...updatedProducts];
    updated[index][field] = value;
    setUpdatedProducts(updated);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = updatedProducts.filter((_, i) => i !== index);
    setUpdatedProducts(updated);
  };

  const handleSaveChanges = () => {
    const updatedPackage = { ...selectedPackage, products: updatedProducts };
    setSelectedPackage(updatedPackage);
    setIsModalOpen(false);
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
          <Text fontSize="lg" fontWeight="bold" mb="4">
            All Packages
          </Text>
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
                  {selectedPackage.products.map((product:any) => (
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

                <Button mt="20px" colorScheme="blue" width="full" onClick={handleModifyPackage}>
                  Modify Package
                </Button>
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

      {/* Modify Package Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {updatedProducts.map((product, index) => (
              <HStack key={index} mb="4">
                <Input
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Product ID"
                  value={product.id}
                  onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                />
                <Input
                  placeholder="Quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                />
                <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleRemoveProduct(index)} aria-label={''}                />
              </HStack>
            ))}
            <Button colorScheme="green" onClick={handleAddProduct}>
              Add Product
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
