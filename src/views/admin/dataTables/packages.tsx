import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  VStack,
  Flex,
  Badge,
  Avatar,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';

// Dummy package data with updated fields
const initialPackages = Array.from({ length: 5 }, (_, i) => ({
  id: `${i + 1}`,
  parentEventId: `EVENT-${i + 1}`,
  archived: i % 2 === 0,
  title: `Package ${i + 1}`,
  pickupPointIds: [`PPID-${i + 1}-A`, `PPID-${i + 1}-B`],
  features: [`Feature 1 for Package ${i + 1}`, `Feature 2 for Package ${i + 1}`],
  shortDescription: `This is a short description for Package ${i + 1}`,
  longDescription: `This is a more detailed and long description for Package ${i + 1}.`,
  images: [`https://example.com/images/package${i + 1}.png`],
  transparentImages: i % 2 !== 0,
  options: [],
}));

const packageEarnings = {
  totalEarnings: '$2000.00',
  balance: '$5000.00',
  withdrawn: '$3000.00',
};

export default function PackagesDashboard() {
  const [packages, setPackages] = useState(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    id: '',
    title: '',
    shortDescription: '',
  });
  const [editPackage, setEditPackage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const toast = useToast();

  const handleCreatePackage = () => {
    if (newPackage.id && newPackage.title && newPackage.shortDescription) {
      const completePackage = {
        ...newPackage,
        parentEventId: 'DEFAULT-EVENT',
        archived: false,
        pickupPointIds: "test",
        features: "test",
        longDescription: '',
        images: "test",
        transparentImages: false,
        options: "test",
      };
      //setPackages([...packages, completePackage]);
      setNewPackage({ id: '', title: '', shortDescription: '' });
      onCreateClose();
      toast({
        title: 'Package created.',
        description: `Package ${newPackage.title} has been added.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error creating package.',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemovePackage = (id:any) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
    setSelectedPackage(null);
    toast({
      title: 'Package removed.',
      description: `Package with ID ${id} has been removed.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleModifyPackage = () => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === editPackage.id ? editPackage : pkg
    );
    setPackages(updatedPackages);
    setSelectedPackage(editPackage);
    setEditPackage(null);
    onClose();
    toast({
      title: 'Package updated.',
      description: `Package ${editPackage.title} has been modified.`,
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
            <Button size="sm" colorScheme="blue" onClick={onCreateOpen}>
              Create Package
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
                <Avatar name={pkg.title} size="sm" />
                <Box>
                  <Text fontWeight="bold">{pkg.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ID: {pkg.id}
                  </Text>
                </Box>
              </Flex>
              <Badge colorScheme={pkg.archived ? 'red' : 'green'}>
                {pkg.archived ? 'Archived' : 'Active'}
              </Badge>
            </Flex>
          ))}
        </Box>

        {/* Right Section */}
        <VStack spacing="20px" align="stretch" gridColumn={{ base: 'span 12', md: 'span 9' }}>
          <Box bg="white" p="20px" borderRadius="8px" shadow="md">
            <Text fontSize="lg" fontWeight="bold" mb="4">
              Package Information
            </Text>
            {selectedPackage ? (
              <>
                <Text fontSize="xl" fontWeight="bold" mb="2">
                  {selectedPackage.title}
                </Text>
                <Text fontSize="sm" color="gray.500" mb="4">
                  ID: {selectedPackage.id}
                </Text>
                <Text mb="4">{selectedPackage.shortDescription}</Text>
                <Flex justify="space-between" mb="4">
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      setEditPackage(selectedPackage);
                      onOpen();
                    }}
                  >
                    Modify Package
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleRemovePackage(selectedPackage.id)}
                  >
                    Remove Package
                  </Button>
                </Flex>
              </>
            ) : (
              <Text>Select a package to view details</Text>
            )}
          </Box>

          {/* Bottom Boxes */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            {/* Package Information Box */}
            <Box bg="white" p="20px" borderRadius="8px" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Detailed Information
              </Text>
              {selectedPackage ? (
                <>
                  <Text mb="2">
                    <strong>Parent Event ID:</strong> {selectedPackage.parentEventId}
                  </Text>
                  <Text mb="2">
                    <strong>Long Description:</strong> {selectedPackage.longDescription}
                  </Text>
                  <Text>
                    <strong>Pickup Points:</strong>{' '}
                    {selectedPackage.pickupPointIds.join(', ')}
                  </Text>
                </>
              ) : (
                <Text>Select a package to view detailed information.</Text>
              )}
            </Box>

            {/* Package Earnings History Box */}
            <Box bg="white" p="20px" borderRadius="8px" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb="4">
                Package Earnings History
              </Text>
              <Text mb="2">
                <strong>Total Earnings:</strong> {packageEarnings.totalEarnings}
              </Text>
              <Text mb="2">
                <strong>Balance:</strong> {packageEarnings.balance}
              </Text>
              <Text>
                <strong>Withdrawn:</strong> {packageEarnings.withdrawn}
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </SimpleGrid>

      {/* Create Package Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <Input
                placeholder="Package ID"
                value={newPackage.id}
                onChange={(e) => setNewPackage({ ...newPackage, id: e.target.value })}
              />
              <Input
                placeholder="Package Title"
                value={newPackage.title}
                onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
              />
              <Input
                placeholder="Short Description"
                value={newPackage.shortDescription}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, shortDescription: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreatePackage}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modify Package Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">
              <Input
                placeholder="Package Title"
                value={editPackage?.title || ''}
                onChange={(e) =>
                  setEditPackage({ ...editPackage, title: e.target.value })
                }
              />
              <Input
                placeholder="Short Description"
                value={editPackage?.shortDescription || ''}
                onChange={(e) =>
                  setEditPackage({ ...editPackage, shortDescription: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleModifyPackage}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
