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

// Define interfaces for types
interface RentPrice {
  hours: number;
  price: number;
}

interface Accessory {
  product_type_id: number;
  rent_prices: RentPrice[] | null;
  buy_price: number;
  payment_type: number;
  allowed_quantity: number;
  selection_type: number;
}

interface Option {
  product_type_id: number;
  rent_prices: RentPrice[] | null;
  buy_price: number;
  payment_type: number;
  allowed_quantity: number;
  accessories: Accessory[];
}

interface FormData {
  business_id: number;
  title: string;
  pickup_point_ids: number[];
  long_description: string;
  short_description: string;
  image_url: string;
  transparent_image: boolean;
  options: Option[];
}

const PackagesTable = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal fields
  const [formData, setFormData] = useState<FormData>({
    business_id: 1, // Default business ID
    title: "",
    pickup_point_ids: [],
    long_description: "",
    short_description: "",
    image_url: "",
    transparent_image: false,
    options: [],
  });

  // Fetch packages data from API
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

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: checked }));
  };

  // Handle modal form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/v1/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Package created successfully:", data);
        setIsModalOpen(false);
        // Refresh the package list
        fetchPackages();
      } else {
        console.error("Failed to create package:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  // Add a new option
  const addOption = () => {
    setFormData((prevData) => ({
      ...prevData,
      options: [
        ...prevData.options,
        {
          product_type_id: 0,
          rent_prices: [],
          buy_price: 0,
          payment_type: 0,
          allowed_quantity: 0,
          accessories: [],
        },
      ],
    }));
  };

  // Add a new rent price to an option
  const addRentPrice = (optionIndex: number) => {
    setFormData((prevData) => ({
      ...prevData,
      options: prevData.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              rent_prices: [...(option.rent_prices || []), { hours: 0, price: 0 }],
            }
          : option
      ),
    }));
  };

  // Add a new accessory to an option
  const addAccessory = (optionIndex: number) => {
    setFormData((prevData) => ({
      ...prevData,
      options: prevData.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              accessories: [
                ...option.accessories,
                {
                  product_type_id: 0,
                  rent_prices: [],
                  buy_price: 0,
                  payment_type: 0,
                  allowed_quantity: 0,
                  selection_type: 0,
                },
              ],
            }
          : option
      ),
    }));
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
        <Box w="50%" borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
          {selectedPackage ? (
            <>
              <Text fontSize="2xl" fontWeight="bold" mb={4}>
                {selectedPackage.title}
              </Text>
              <Divider mb={4} />

              <Flex direction="column" gap={4}>
                <Box>
                  <Image
                    src={selectedPackage.image_url}
                    alt={selectedPackage.title}
                    boxSize="300px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={4}
                  />
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Short Description:
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {selectedPackage.short_description}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Long Description:
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {selectedPackage.long_description}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Pickup Points:
                  </Text>
                  {selectedPackage.pickup_points.map((point: any) => (
                    <Box
                      key={point.ID}
                      mb={4}
                      pl={4}
                      borderLeft="2px solid"
                      borderColor="teal.200"
                    >
                      <Text fontSize="md" fontWeight="medium">
                        Address:{" "}
                        <Text as="span" color="gray.600">
                          {point.address}
                        </Text>
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        City:{" "}
                        <Text as="span" color="gray.600">
                          {point.city}
                        </Text>
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        Country:{" "}
                        <Text as="span" color="gray.600">
                          {point.country}
                        </Text>
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        Postal Code:{" "}
                        <Text as="span" color="gray.600">
                          {point.postal_code}
                        </Text>
                      </Text>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Product Options:
                  </Text>
                  {selectedPackage.options.map((option: Option) => (
                    <Box
                      key={option.product_type_id}
                      mb={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg="gray.50"
                    >
                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        Product Type ID:{" "}
                        <Text as="span" color="gray.600">
                          {option.product_type_id}
                        </Text>
                      </Text>
                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        Buy Price:{" "}
                        <Text as="span" color="gray.600">
                          {option.buy_price}
                        </Text>
                      </Text>
                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        Allowed Quantity:{" "}
                        <Text as="span" color="gray.600">
                          {option.allowed_quantity}
                        </Text>
                      </Text>

                      <Divider my={2} />

                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        Rent Prices:
                      </Text>
                      {option.rent_prices?.map((rentPrice, index) => (
                        <Box key={index} ml={4} mb={2}>
                          <Text fontSize="sm" color="gray.600">
                            - Hours: {rentPrice.hours}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            - Price: {rentPrice.price}
                          </Text>
                        </Box>
                      ))}

                      <Divider my={2} />

                      <Text fontSize="md" fontWeight="medium" mb={2}>
                        Accessories:
                      </Text>
                      {option.accessories.map((acc: Accessory) => (
                        <Box key={acc.product_type_id} ml={4} mb={2}>
                          <Text fontSize="sm" color="gray.600">
                            - Product Type ID: {acc.product_type_id}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            - Buy Price: {acc.buy_price}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            - Allowed Quantity: {acc.allowed_quantity}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Flex>
            </>
          ) : (
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Select a package to view details.
            </Text>
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
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter package title"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Short Description</FormLabel>
              <Textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                placeholder="Enter short description"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Long Description</FormLabel>
              <Textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleInputChange}
                placeholder="Enter long description"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Transparent Image</FormLabel>
              <Checkbox
                name="transparent_image"
                isChecked={formData.transparent_image}
                onChange={handleCheckboxChange}
              >
                Transparent Image
              </Checkbox>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Pickup Point IDs</FormLabel>
              <Input
                name="pickup_point_ids"
                value={formData.pickup_point_ids.join(",")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pickup_point_ids: e.target.value
                      .split(",")
                      .map((id) => parseInt(id.trim(), 10)),
                  })
                }
                placeholder="Enter pickup point IDs (e.g., 1, 2, 3)"
              />
            </FormControl>

            {/* Add Product Options */}
            {formData.options.map((option, optionIndex) => (
              <Box key={optionIndex} mt={4} borderWidth="1px" borderRadius="lg" p={4}>
                <FormControl>
                  <FormLabel>Product Type ID</FormLabel>
                  <Input
                    name="product_type_id"
                    value={option.product_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, index) =>
                          index === optionIndex
                            ? { ...opt, product_type_id: parseInt(e.target.value, 10) }
                            : opt
                        ),
                      })
                    }
                    placeholder="Enter product type ID"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Buy Price</FormLabel>
                  <Input
                    name="buy_price"
                    value={option.buy_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, index) =>
                          index === optionIndex
                            ? { ...opt, buy_price: parseFloat(e.target.value) }
                            : opt
                        ),
                      })
                    }
                    placeholder="Enter buy price"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Allowed Quantity</FormLabel>
                  <Input
                    name="allowed_quantity"
                    value={option.allowed_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, index) =>
                          index === optionIndex
                            ? { ...opt, allowed_quantity: parseInt(e.target.value, 10) }
                            : opt
                        ),
                      })
                    }
                    placeholder="Enter allowed quantity"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Payment Type</FormLabel>
                  <Input
                    name="payment_type"
                    value={option.payment_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, index) =>
                          index === optionIndex
                            ? { ...opt, payment_type: parseInt(e.target.value, 10) }
                            : opt
                        ),
                      })
                    }
                    placeholder="Enter payment type"
                  />
                </FormControl>

                {/* Add Rent Prices */}
                <FormControl mt={4}>
  <FormLabel>Rent Prices</FormLabel>
  {option.rent_prices?.map((rentPrice, rentIndex) => (
    <Flex key={rentIndex} gap={2} mb={2}>
      <Input
        name="hours"
        value={rentPrice.hours}
        onChange={(e) =>
          setFormData({
            ...formData,
            options: formData.options.map((opt, index) =>
              index === optionIndex
                ? {
                    ...opt,
                    rent_prices: opt.rent_prices?.map((rp, i) =>
                      i === rentIndex
                        ? { ...rp, hours: parseInt(e.target.value, 10) }
                        : rp
                    ),
                  }
                : opt
            ),
          })
        }
        placeholder="Enter hours (e.g., 24)"
      />
      <Input
        name="price"
        value={rentPrice.price}
        onChange={(e) =>
          setFormData({
            ...formData,
            options: formData.options.map((opt, index) =>
              index === optionIndex
                ? {
                    ...opt,
                    rent_prices: opt.rent_prices?.map((rp, i) =>
                      i === rentIndex
                        ? { ...rp, price: parseFloat(e.target.value) }
                        : rp
                    ),
                  }
                : opt
            ),
          })
        }
        placeholder="Enter price (e.g., 50.0)"
      />
    </Flex>
  ))}
  <Button
    mt={2}
    colorScheme="teal"
    onClick={() => addRentPrice(optionIndex)}
  >
    Add Rent Price
  </Button>
</FormControl>

                {/* Add Accessories */}
                <FormControl mt={4}>
  <FormLabel>Accessories</FormLabel>
  {option.accessories.map((accessory, accIndex) => (
    <Box key={accIndex} mb={4} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
      <Flex gap={2} mb={2}>
        <Input
          name="product_type_id"
          value={accessory.product_type_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              options: formData.options.map((opt, index) =>
                index === optionIndex
                  ? {
                      ...opt,
                      accessories: opt.accessories.map((acc, i) =>
                        i === accIndex
                          ? {
                              ...acc,
                              product_type_id: parseInt(e.target.value, 10),
                            }
                          : acc
                      ),
                    }
                  : opt
              ),
            })
          }
          placeholder="Enter product type ID (e.g., 2)"
        />
        <Input
          name="buy_price"
          value={accessory.buy_price}
          onChange={(e) =>
            setFormData({
              ...formData,
              options: formData.options.map((opt, index) =>
                index === optionIndex
                  ? {
                      ...opt,
                      accessories: opt.accessories.map((acc, i) =>
                        i === accIndex
                          ? { ...acc, buy_price: parseFloat(e.target.value) }
                          : acc
                      ),
                    }
                  : opt
              ),
            })
          }
          placeholder="Enter buy price (e.g., 50.0)"
        />
      </Flex>
      <Flex gap={2} mb={2}>
        <Input
          name="allowed_quantity"
          value={accessory.allowed_quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              options: formData.options.map((opt, index) =>
                index === optionIndex
                  ? {
                      ...opt,
                      accessories: opt.accessories.map((acc, i) =>
                        i === accIndex
                          ? {
                              ...acc,
                              allowed_quantity: parseInt(e.target.value, 10),
                            }
                          : acc
                      ),
                    }
                  : opt
              ),
            })
          }
          placeholder="Enter allowed quantity (e.g., 10)"
        />
        <Input
          name="payment_type"
          value={accessory.payment_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              options: formData.options.map((opt, index) =>
                index === optionIndex
                  ? {
                      ...opt,
                      accessories: opt.accessories.map((acc, i) =>
                        i === accIndex
                          ? {
                              ...acc,
                              payment_type: parseInt(e.target.value, 10),
                            }
                          : acc
                      ),
                    }
                  : opt
              ),
            })
          }
          placeholder="Enter payment type (e.g., 0)"
        />
        <Input
          name="selection_type"
          value={accessory.selection_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              options: formData.options.map((opt, index) =>
                index === optionIndex
                  ? {
                      ...opt,
                      accessories: opt.accessories.map((acc, i) =>
                        i === accIndex
                          ? {
                              ...acc,
                              selection_type: parseInt(e.target.value, 10),
                            }
                          : acc
                      ),
                    }
                  : opt
              ),
            })
          }
          placeholder="Enter selection type (e.g., 1)"
        />
      </Flex>
    </Box>
  ))}
  <Button
    mt={2}
    colorScheme="teal"
    onClick={() => addAccessory(optionIndex)}
  >
    Add Accessory
  </Button>
</FormControl>
              </Box>
            ))}

            <Button mt={4} colorScheme="teal" onClick={addOption}>
              Add Product Option
            </Button>
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