import React, { useState, useEffect } from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    Switch,
    Flex,
    Image,
    VStack,
    Tag,
    Tooltip,
    Icon,
    Fade,
    Collapse,
    Button,
    useDisclosure,
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
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
} from '@chakra-ui/react';
import { InfoIcon, EditIcon } from '@chakra-ui/icons';
import { FiImage } from 'react-icons/fi';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment';
import axios from 'axios';

export default function Settings() {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [viewProductTypes, setViewProductTypes] = useState<boolean>(false);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
    const [editFormData, setEditFormData] = useState<any>({});
    const [addFormData, setAddFormData] = useState({
        title: '',
        short_description: '',
        long_description: '',
        image_url: '',
        transparent_image: false,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    // Fetch product types when the view switches to product types
    useEffect(() => {
        if (viewProductTypes) {
            fetchProductTypes();
        } else {
            setProductTypes([]);
        }
    }, [viewProductTypes]);

    // Fetch product types from the API
    const fetchProductTypes = () => {
        setIsLoading(true);
        axios
            .get('http://127.0.0.1:3000/v1/producttype')
            .then((response) => {
                if (response.data.code === 200) {
                    setProductTypes(response.data.data);
                } else {
                    console.error('Failed to fetch product types');
                }
            })
            .catch((error) => {
                console.error('Error fetching product types:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle item click (product or product type)
    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setShowFullDescription(false);
    };

    // Handle edit button click
    const handleEditClick = () => {
        setEditFormData(selectedItem);
        onOpen();
    };

    // Handle input changes in the edit modal
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    // Save changes in the edit modal
    const handleSaveChanges = () => {
        setIsLoading(true);
        axios
            .put(`http://127.0.0.1:3000/v1/product_type/${editFormData.ID}`, editFormData)
            .then((response) => {
                if (response.data.code === 200) {
                    setSelectedItem(editFormData);
                    setProductTypes((prev) =>
                        prev.map((item) => (item.ID === editFormData.ID ? editFormData : item))
                    );
                    onClose();
                } else {
                    console.error('Failed to update product type');
                }
            })
            .catch((error) => {
                console.error('Error updating product type:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Handle input changes in the add modal
    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value,
        });
    };

    // Handle transparent image toggle in the add modal
    const handleAddTransparentImageToggle = () => {
        setAddFormData({
            ...addFormData,
            transparent_image: !addFormData.transparent_image,
        });
    };

    // Add a new product type
    const handleAddProductType = () => {
        setIsLoading(true);

        // Optimistically update the state
        const newItem = {
            ...addFormData,
            ID: Date.now(), // Temporary ID (replace with actual ID from the API response)
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        };
        setProductTypes((prev) => [...prev, newItem]);
        setSelectedItem(newItem);

        // Make the API call
        axios
            .post('http://127.0.0.1:3000/v1/producttype', addFormData)
            .then((response) => {
                console.log('API Response:', response);
                if (response.status === 201) {
                    const updatedItem = response.data.data || response.data;
                    setProductTypes((prev) =>
                        prev.map((item) => (item.ID === newItem.ID ? updatedItem : item))
                    );
                    setSelectedItem(updatedItem);
                    onCloseAddModal(); // Close the modal after successful API call
                    setAddFormData({ // Reset the form data
                        title: '',
                        short_description: '',
                        long_description: '',
                        image_url: '',
                        transparent_image: false,
                    });
                } else {
                    console.error('Failed to add product type: Invalid response', response);
                }
            })
            .catch((error) => {
                console.error('Error adding product type:', error);
                // Revert the optimistic update if the API call fails
                setProductTypes((prev) => prev.filter((item) => item.ID !== newItem.ID));
                setSelectedItem(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Add a new product
    const handleAddProduct = () => {
        setIsLoading(true);

        // Make the API call
        axios
            .post('http://127.0.0.1:3000/v1/product', addFormData)
            .then((response) => {
                console.log('API Response:', response);
                if (response.status === 201 && response.data.data) {
                    const newItem = response.data.data;
                    setAddFormData({
                        title: '',
                        short_description: '',
                        long_description: '',
                        image_url: '',
                        transparent_image: false,
                    });
                    setSelectedItem(newItem);
                    onCloseAddModal(); // Close the modal after successful API call
                } else {
                    console.error('Failed to add product: Invalid response');
                }
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productTypes.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Base box styling for containers
    const boxStyles = {
        border: "1px solid",
        borderColor: "gray.200",
        p: "20px",
        borderRadius: "8px",
        boxShadow: "md",
        bg: "white",
    };

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Flex justify="space-between" align="center" mb="20px">
                <Text fontSize="2xl" fontWeight="bold">
                    {viewProductTypes ? 'Product Types' : 'Products'}
                </Text>
                <Flex align="center">
                    <Text mr="10px">View Product Types</Text>
                    <Switch
                        isChecked={viewProductTypes}
                        onChange={() => {
                            setViewProductTypes(!viewProductTypes);
                            setSelectedItem(null);
                        }}
                    />
                    {/* Dynamic Add Button */}
                    <Button colorScheme="blue" ml="10px" onClick={onOpenAddModal}>
                        {viewProductTypes ? 'Add Product Type' : 'Add Product'}
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
                {/* Left Box with Table */}
                <Box {...boxStyles}>
                    {viewProductTypes ? (
                        isLoading ? (
                            <Flex justify="center" align="center" h="200px">
                                <Spinner size="xl" />
                            </Flex>
                        ) : (
                            <>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Title</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Divider orientation="horizontal" borderColor="gray.300" />
                                    <Tbody>
                                        {currentItems.map((item, index) => (
                                            <Tr key={item?.ID || index} onClick={() => handleItemClick(item)}>
                                                <Td>{item?.title || 'N/A'}</Td>
                                                <Td>
                                                    <Button size="sm" onClick={() => handleItemClick(item)}>
                                                        View Details
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                {/* Pagination */}
                                <Flex justify="center" mt="20px">
                                    {Array.from({ length: Math.ceil(productTypes.length / itemsPerPage) }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? 'solid' : 'outline'}
                                            colorScheme="blue"
                                            mx="1"
                                            onClick={() => paginate(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </Flex>
                            </>
                        )
                    ) : (
                        <DevelopmentTable
                            tableData={tableDataDevelopment}
                            onProductClick={handleItemClick}
                        />
                    )}
                </Box>

                {/* Right Box with Details */}
                <Box
                    {...boxStyles}
                    textAlign="center"
                    _hover={{ boxShadow: 'xl', transform: 'scale(1.02)', transition: '0.3s ease' }}
                >
                    {selectedItem ? (
                        <Fade in={!!selectedItem}>
                            <VStack spacing={4}>
                                <Flex justify="flex-end" w="full">
                                    <Icon
                                        as={EditIcon}
                                        boxSize="5"
                                        color="gray.500"
                                        cursor="pointer"
                                        _hover={{ color: 'blue.500' }}
                                        onClick={handleEditClick}
                                    />
                                </Flex>

                                {selectedItem.image_url ? (
                                    <Image
                                        src={selectedItem.image_url}
                                        alt={selectedItem.title}
                                        borderRadius="md"
                                        boxShadow="md"
                                        maxW="200px"
                                        maxH="200px"
                                        objectFit="cover"
                                        _hover={{ transform: 'scale(1.05)', transition: '0.2s ease' }}
                                    />
                                ) : (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        w="200px"
                                        h="200px"
                                        bg="gray.100"
                                        borderRadius="md"
                                        boxShadow="md"
                                    >
                                        <Icon as={FiImage} boxSize="8" color="gray.400" />
                                    </Flex>
                                )}

                                <Text fontSize="lg" fontWeight="bold">
                                    {selectedItem?.title || 'No title available'}
                                </Text>

                                <Text color="gray.600" fontSize="md">
                                    {selectedItem.short_description || 'No short description available.'}
                                </Text>

                                <Box textAlign="left" w="full">
                                    <Collapse startingHeight={60} in={showFullDescription}>
                                        <Text color="gray.600" fontSize="md">
                                            {selectedItem.long_description || 'No long description available.'}
                                        </Text>
                                    </Collapse>
                                    <Button
                                        size="sm"
                                        mt="10px"
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                    >
                                        {showFullDescription ? 'Show Less' : 'Read More'}
                                    </Button>
                                </Box>

                                <VStack spacing={2} align="start" w="full">
                                    <Text fontSize="sm" color="gray.500">
                                        <strong>Created At:</strong> {new Date(selectedItem.CreatedAt).toLocaleString()}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        <strong>Updated At:</strong> {new Date(selectedItem.UpdatedAt).toLocaleString()}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        <strong>Transparent Image:</strong> {selectedItem.transparent_image ? 'Yes' : 'No'}
                                    </Text>
                                </VStack>
                            </VStack>
                        </Fade>
                    ) : (
                        <Text color="gray.500">
                            Select a {viewProductTypes ? 'product type' : 'product'} to see its details here.
                        </Text>
                    )}
                </Box>
            </SimpleGrid>

            {/* Edit Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit {viewProductTypes ? 'Product Type' : 'Product'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input
                                name="title"
                                value={editFormData.title || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Short Description</FormLabel>
                            <Input
                                name="short_description"
                                value={editFormData.short_description || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Long Description</FormLabel>
                            <Textarea
                                name="long_description"
                                value={editFormData.long_description || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                name="image_url"
                                value={editFormData.image_url || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Transparent Image</FormLabel>
                            <Flex align="center">
                                <Text mr="10px" fontSize="sm" color="gray.500">
                                    {editFormData.transparent_image ? 'Yes' : 'No'}
                                </Text>
                                <Switch
                                    isChecked={editFormData.transparent_image}
                                    onChange={() =>
                                        setEditFormData({
                                            ...editFormData,
                                            transparent_image: !editFormData.transparent_image,
                                        })
                                    }
                                    colorScheme="green"
                                />
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={onCloseAddModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add {viewProductTypes ? 'Product Type' : 'Product'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input
                                name="title"
                                value={addFormData.title}
                                onChange={handleAddInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Short Description</FormLabel>
                            <Input
                                name="short_description"
                                value={addFormData.short_description}
                                onChange={handleAddInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Long Description</FormLabel>
                            <Textarea
                                name="long_description"
                                value={addFormData.long_description}
                                onChange={handleAddInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                name="image_url"
                                value={addFormData.image_url}
                                onChange={handleAddInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Transparent Image</FormLabel>
                            <Flex align="center">
                                <Text mr="10px" fontSize="sm" color="gray.500">
                                    {addFormData.transparent_image ? 'Yes' : 'No'}
                                </Text>
                                <Switch
                                    isChecked={addFormData.transparent_image}
                                    onChange={handleAddTransparentImageToggle}
                                    colorScheme="green"
                                />
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={viewProductTypes ? handleAddProductType : handleAddProduct}>
                            Add {viewProductTypes ? 'Product Type' : 'Product'}
                        </Button>
                        <Button variant="ghost" onClick={onCloseAddModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}