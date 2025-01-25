import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Flex,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

const Dashboard = () => {
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    title: "",
    short_description: "",
    long_description: "",
    image_url: "",
    pickup_points: [],
  });

  const rowsPerPage = 5;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch data
  useEffect(() => {
    fetch("http://127.0.0.1:3000/v1/packages")
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setPackages(data.data);
        }
      })
      .catch((error) => console.error("Error fetching packages:", error));
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(packages.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = packages.slice(startIndex, startIndex + rowsPerPage);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handle input changes for new package
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setNewPackage({ ...newPackage, [name]: value });
  };

  // Add a new package
  // Add a new package
const handleAddPackage = () => {
  // Validate the form data (optional, but recommended)
  if (!newPackage.title || !newPackage.short_description || !newPackage.image_url) {
    alert("Please fill all required fields.");
    return;
  }

  // Send new package data to the backend
  fetch("http://127.0.0.1:3000/v1/packages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newPackage.title,
      short_description: newPackage.short_description,
      long_description: newPackage.long_description,
      image_url: newPackage.image_url,
      pickup_points: newPackage.pickup_points,  // Ensure this matches what the backend expects
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 200) {
        setPackages((prevPackages) => [data.data, ...prevPackages]);
        onClose();
      } else {
        alert("Error creating package: " + data.message);
      }
    })
    .catch((error) => console.error("Error adding package:", error));
};


  return (
    <Flex p={6} gap={6} pt={20}>
      {/* Table Section */}
      <Box width="60%">
        {/* Create New Package Button */}
        <Flex justifyContent="space-between" mb={4}>
          <Button colorScheme="green" onClick={onOpen}>
            Create New Package
          </Button>
        </Flex>

        <TableContainer
          border="1px solid"
          borderColor="gray.200"
          rounded="lg"
          p={4}
        >
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th p={4}>Title</Th>
                <Th p={4}>Short Description</Th>
                <Th p={4}>Pickup Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((pkg) => (
                <Tr
                  key={pkg.ID}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <Td p={4}>
                    <Text fontWeight="bold">{pkg.title}</Text>
                  </Td>
                  <Td p={4}>{pkg.short_description}</Td>
                  <Td p={4}>
                    {pkg.pickup_points.map((point:any) => (
                      <Box key={point.ID}>
                        <Text fontSize="sm">{point.address}</Text>
                      </Box>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Button
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            colorScheme="blue"
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            colorScheme="blue"
          >
            Next
          </Button>
        </Flex>
      </Box>

      {/* Details Section */}
      <Box
        width="40%"
        p={6}
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        boxShadow="md"
      >
        {selectedPackage ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {selectedPackage.title}
            </Text>
            <Image
              src={selectedPackage.image_url}
              alt={selectedPackage.title}
              borderRadius="md"
              mb={4}
            />
            <Text fontSize="md" mb={4}>
              {selectedPackage.long_description}
            </Text>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Pickup Points:
              </Text>
              {selectedPackage.pickup_points.map((point:any) => (
                <Box key={point.ID}>
                  <Text fontSize="sm">
                    {point.address}, {point.city}, {point.country}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Postal Code: {point.postal_code}
                  </Text>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Text>Select a package to see details</Text>
        )}
      </Box>

      {/* Create New Package Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={newPackage.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Short Description</FormLabel>
              <Textarea
                name="short_description"
                value={newPackage.short_description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Long Description</FormLabel>
              <Textarea
                name="long_description"
                value={newPackage.long_description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image_url"
                value={newPackage.image_url}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddPackage}>
              Add Package
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Dashboard;
