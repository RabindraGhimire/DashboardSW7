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
  Select,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

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
  features: string[]; // New field
  options: Option[];
}

interface ProductInstance {
  ID: number;
  title?: string;
}

const PackagesTable = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productInstances, setProductInstances] = useState<ProductInstance[]>([]);

  const [formData, setFormData] = useState<FormData>({
    business_id: 1,
    title: "",
    pickup_point_ids: [],
    long_description: "",
    short_description: "",
    image_url: "",
    transparent_image: false,
    features: [], // Initialize features as an empty array
    options: [],
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:3000/v1/packages?page=1&limit=5`
        );
        const data = await response.json();
        setPackages(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setIsLoading(false);
      }
    };

    const fetchProductInstances = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/v1/productinstance`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProductInstances(data.data || []);
      } catch (error) {
        console.error("Error fetching product instances:", error);
        setProductInstances([]);
      }
    };

    fetchPackages();
    if (isModalOpen) {
      fetchProductInstances();
    }
  }, [isModalOpen]);

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
        setIsModalOpen(false);
        setFormData({
          business_id: 1,
          title: "",
          pickup_point_ids: [],
          long_description: "",
          short_description: "",
          image_url: "",
          transparent_image: false,
          features: [],
          options: [],
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

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

  const handleProductSelect = (optionIndex: number, productId: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === optionIndex ? {
          ...opt,
          product_type_id: productId
        } : opt
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addRentPrice = (optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === optionIndex ? {
          ...opt,
          rent_prices: [...(opt.rent_prices || []), { hours: 0, price: 0 }],
        } : opt
      ),
    }));
  };

  const updateRentPrice = (optionIndex: number, priceIndex: number, field: keyof RentPrice, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => {
        if (idx === optionIndex) {
          const newRentPrices = [...(opt.rent_prices || [])];
          newRentPrices[priceIndex] = {
            ...newRentPrices[priceIndex],
            [field]: Number(value),
          };
          return {
            ...opt,
            rent_prices: newRentPrices,
          };
        }
        return opt;
      }),
    }));
  };

  const removeRentPrice = (optionIndex: number, priceIndex: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => {
        if (idx === optionIndex) {
          const newRentPrices = [...(opt.rent_prices || [])];
          newRentPrices.splice(priceIndex, 1);
          return {
            ...opt,
            rent_prices: newRentPrices,
          };
        }
        return opt;
      }),
    }));
  };

  return (
    <Box p={4} pt={20}>
      <Flex justifyContent="space-between" mb={4}>
        <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
          Create New Package
        </Button>
      </Flex>

      <Flex gap={4}>
        {/* Left package list remains same */}
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
                {packages.map((pkg: any) => (
                  <Tr key={pkg.ID}>
                    <Td>{pkg.title}</Td>
                    <Td>{pkg.short_description}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Right package details remain same */}
        <Box w="50%" borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
          {/* ... existing package details view ... */}
        </Box>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
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
                value={formData.pickup_point_ids.join(",")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pickup_point_ids: e.target.value
                      .split(",")
                      .map((id) => parseInt(id.trim(), 10)),
                  })
                }
                placeholder="Enter comma-separated IDs"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Features</FormLabel>
              {formData.features.map((feature, index) => (
                <HStack key={index} mb={2}>
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter feature"
                  />
                  <IconButton
                    aria-label="Remove feature"
                    icon={<DeleteIcon />}
                    onClick={() => removeFeature(index)}
                  />
                </HStack>
              ))}
              <Button
                mt={2}
                leftIcon={<AddIcon />}
                onClick={addFeature}
              >
                Add Feature
              </Button>
            </FormControl>

            {formData.options.map((option, optionIndex) => (
              <Box key={optionIndex} mt={4} p={4} borderWidth="1px" borderRadius="lg">
                <FormControl>
                  <FormLabel>Select Product Instance</FormLabel>
                  <Select
                    placeholder="Select product"
                    value={option.product_type_id || ""}
                    onChange={(e) => 
                      handleProductSelect(optionIndex, Number(e.target.value))
                    }
                  >
                    {productInstances.map((product) => (
                      <option key={product.ID} value={product.ID}>
                        #{product.ID} - {product.title || "Untitled Product"}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Buy Price</FormLabel>
                  <Input
                    value={option.buy_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, idx) =>
                          idx === optionIndex
                            ? { ...opt, buy_price: Number(e.target.value) }
                            : opt
                        ),
                      })
                    }
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Allowed Quantity</FormLabel>
                  <Input
                    value={option.allowed_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((opt, idx) =>
                          idx === optionIndex
                            ? { ...opt, allowed_quantity: Number(e.target.value) }
                            : opt
                        ),
                      })
                    }
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Rent Prices</FormLabel>
                  {option.rent_prices?.map((rentPrice, priceIndex) => (
                    <HStack key={priceIndex} mb={2}>
                      <Input
                        type="number"
                        placeholder="Hours"
                        value={rentPrice.hours}
                        onChange={(e) => 
                          updateRentPrice(optionIndex, priceIndex, 'hours', e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={rentPrice.price}
                        onChange={(e) => 
                          updateRentPrice(optionIndex, priceIndex, 'price', e.target.value)
                        }
                      />
                      <IconButton
                        aria-label="Remove rent price"
                        icon={<DeleteIcon />}
                        onClick={() => removeRentPrice(optionIndex, priceIndex)}
                      />
                    </HStack>
                  ))}
                  <Button
                    mt={2}
                    leftIcon={<AddIcon />}
                    onClick={() => addRentPrice(optionIndex)}
                  >
                    Add Rent Price
                  </Button>
                </FormControl>
              </Box>
            ))}

            <Button mt={4} colorScheme="teal" onClick={addOption}>
              Add Product Option
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Package
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PackagesTable;