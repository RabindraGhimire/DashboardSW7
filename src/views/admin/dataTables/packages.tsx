import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Divider,
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
  Checkbox,
} from "@chakra-ui/react";
import Select from "react-select";

// Define interfaces for types
interface Option {
  ID: string;
  available_quantity: number;
  allowed_quantity: number;
  accessories: Accessory[];
}

interface Accessory {
  ID: string;
  name: string;
  available_quantity: number;
  allowed_quantity: number;
}

interface ProductType {
  type: string;
  accessories: string[];
}

interface FormData {
  archived: boolean;
  title: string;
  pickupPoints: string;
  features: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  transparentImage: boolean;
  productTypes: ProductType[];
}

const PackagesTable = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal fields
  const [formData, setFormData] = useState<FormData>({
    archived: false,
    title: "",
    pickupPoints: "",
    features: "",
    shortDescription: "",
    longDescription: "",
    imageUrl: "",
    transparentImage: false,
    productTypes: [],
  });

  const [availableAccessories, setAvailableAccessories] = useState<Accessory[][]>([]);

  // Fetch packages data from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:3000/v1/packages?page=1&limit=5`
        );
        const data = await response.json();
        setPackages(data.data); // Assuming the API response structure
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: checked }));
  };

  // Add a new product type
  const addProductType = () => {
    setFormData((prevData) => ({
      ...prevData,
      productTypes: [
        ...prevData.productTypes,
        {
          type: "",
          accessories: [],
        },
      ],
    }));
  };

  // Handle product type change
  const handleProductTypeChange = async (index: number, selectedOption: any) => {
    const updatedProductTypes = [...formData.productTypes];
    updatedProductTypes[index].type = selectedOption.value;
    setFormData((prevData) => ({
      ...prevData,
      productTypes: updatedProductTypes,
    }));

    // Fetch accessories based on selected product type
    if (selectedOption.value) {
      const accessories = await fetchAccessories(selectedOption.value);
      setAvailableAccessories((prev) => {
        const newAccessories = [...prev];
        newAccessories[index] = accessories;
        return newAccessories;
      });
    }
  };

  // Fetch accessories based on product type
  const fetchAccessories = async (productType: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/v1/accessories?productType=${productType}`
      );
      const data = await response.json();
      return data.accessories;
    } catch (error) {
      console.error("Error fetching accessories:", error);
      return [];
    }
  };

  // Handle accessory selection
  const handleAccessorySelection = (productTypeIndex: number, accessoryId: string, isChecked: boolean) => {
    const updatedProductTypes = [...formData.productTypes];
    if (isChecked) {
      updatedProductTypes[productTypeIndex].accessories.push(accessoryId);
    } else {
      updatedProductTypes[productTypeIndex].accessories = updatedProductTypes[
        productTypeIndex
      ].accessories.filter((id: string) => id !== accessoryId);
    }
    setFormData((prevData) => ({
      ...prevData,
      productTypes: updatedProductTypes,
    }));
  };

  // Handle modal form submission
  const handleSubmit = () => {
    console.log("Form data submitted:", formData);
    setIsModalOpen(false);
  };

  // Product type options
  const productTypeOptions = [
    { value: "type1", label: "Type 1" },
    { value: "type2", label: "Type 2" },
    { value: "type3", label: "Type 3" },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #E2E8F0",
      borderRadius: "6px",
      minHeight: "40px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3182CE",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3182CE" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "#3182CE",
        color: "white",
      },
    }),
  };

  return (
    <Box p={4} pt={20}>
      {/* Top bar with Create New Package button */}
      <Flex justifyContent="space-between" mb={4}>
        <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
          Create New Package
        </Button>
      </Flex>

      <Flex gap={4}>
        {/* Left box: Package list */}
        <Box w="50%" borderWidth="1px" borderRadius="lg" p={4} overflowY="auto">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!isLoading && packages.length > 0 ? (
                  packages.map((pkg: any) => (
                    <Tr key={pkg.ID}>
                      <Td>{pkg.title}</Td>
                      <Td>{pkg.short_description}</Td>
                      <Td>
                        <Button
                          size="md"
                          bgGradient="linear(to-r, blue.400, blue.600)"
                          color="white"
                          _hover={{
                            bgGradient: "linear(to-r, blue.500, blue.700)",
                          }}
                          _active={{ bg: "blue.700" }}
                          boxShadow="md"
                          borderRadius="lg"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3}>
                      {isLoading ? "Loading..." : "No packages found."}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Right box: Package details */}
        <Box w="50%" borderWidth="1px" borderRadius="lg" p={6}>
          {selectedPackage ? (
            <>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>
                {selectedPackage.title}
              </Text>
              <Divider mb={4} />
              <Image
                src={selectedPackage.image_url}
                alt={selectedPackage.title}
                boxSize="300px"
                mb={4}
                borderRadius="md"
              />
              <Divider mb={4} />
              <Text fontSize="lg" fontWeight="bold" mt={2}>
                Short Description:
              </Text>
              <Text mb={4}>{selectedPackage.short_description}</Text>

              <Divider mb={4} />
              <Text fontSize="lg" fontWeight="bold">
                Long Description:
              </Text>
              <Text mb={4}>{selectedPackage.long_description}</Text>

              <Divider mb={4} />
              <Text fontSize="lg" fontWeight="bold">
                Pickup Points:
              </Text>
              {selectedPackage.pickup_points.map((point: any) => (
                <Box key={point.ID} mb={4} pl={4}>
                  <Text>Address: {point.address}</Text>
                  <Text>City: {point.city}</Text>
                  <Text>Country: {point.country}</Text>
                  <Text>Postal Code: {point.postal_code}</Text>
                </Box>
              ))}

              <Divider mb={4} />
              {selectedPackage.options.map((option: Option) => (
                <Box key={option.ID} mb={4}>
                  <Text fontSize="lg" fontWeight="bold">Quantity:</Text>
                  <Text>Available Quantity: {option.available_quantity}</Text>
                  <Text>Allowed Quantity: {option.allowed_quantity}</Text>
                  <Text fontSize="lg" fontWeight="bold">Accessories:</Text>
                  {option.accessories.map((acc: Accessory) => (
                    <Box key={acc.ID} ml={4}>
                      <Text fontSize="lg" fontWeight="bold"> {acc.ID}</Text>
                      <Text>- Available Quantity: {acc.available_quantity}</Text>
                      <Text>- Allowed Quantity: {acc.allowed_quantity}</Text>
                    </Box>
                  ))}
                </Box>
              ))}
            </>
          ) : (
            <Text>Select a package to view details.</Text>
          )}
        </Box>
      </Flex>

      {/* Modal for creating a new package */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Archived</FormLabel>
              <Checkbox
                name="archived"
                isChecked={formData.archived}
                onChange={handleCheckboxChange}
              >
                Archived
              </Checkbox>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter package title"
              />
            </FormControl>

            {/* Product Types Repeater */}
            {formData.productTypes.map((productType, index) => (
              <Box key={index} mt={4} borderWidth="1px" borderRadius="lg" p={4}>
                <FormControl>
                  <FormLabel>Product Type</FormLabel>
                  <Select
                    options={productTypeOptions}
                    value={productTypeOptions.find(
                      (option) => option.value === productType.type
                    )}
                    onChange={(selectedOption) =>
                      handleProductTypeChange(index, selectedOption)
                    }
                    placeholder="Select product type"
                    styles={customStyles}
                  />
                </FormControl>

                {/* Accessories for the product type */}
                {availableAccessories[index] && (
                  <FormControl mt={4}>
                    <FormLabel>Accessories</FormLabel>
                    {availableAccessories[index].map((accessory: Accessory) => (
                      <Box key={accessory.ID} mt={2}>
                        <Checkbox
                          isChecked={productType.accessories.includes(accessory.ID)}
                          onChange={(e) =>
                            handleAccessorySelection(
                              index,
                              accessory.ID,
                              e.target.checked
                            )
                          }
                        >
                          {accessory.name}
                        </Checkbox>
                      </Box>
                    ))}
                  </FormControl>
                )}
              </Box>
            ))}

            {/* Add Product Type Button */}
            <Button mt={4} colorScheme="teal" onClick={addProductType}>
              Add Product Type
            </Button>

            <FormControl mt={4}>
              <FormLabel>Short Description</FormLabel>
              <Textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Enter short description"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Long Description</FormLabel>
              <Textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Enter long description"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Transparent Image</FormLabel>
              <Checkbox
                name="transparentImage"
                isChecked={formData.transparentImage}
                onChange={handleCheckboxChange}
              >
                Transparent Image
              </Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Create Package
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PackagesTable;