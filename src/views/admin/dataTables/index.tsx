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
} from '@chakra-ui/react';
import { InfoIcon, EditIcon } from '@chakra-ui/icons';
import { FiImage } from 'react-icons/fi';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable'; // Assuming this component exists
import ProductTypeTable from './components/ProductTypeTable';
import axios from 'axios';

export default function Settings() {
    const [selectedItem, setSelectedItem] = useState<any>(null); // Tracks the selected product or product type
    const [viewProductTypes, setViewProductTypes] = useState<boolean>(false); // Toggle for table view
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false); // State for description toggle
    const [productTypes, setProductTypes] = useState<any[]>([]); // State for product types
    const [productInstances, setProductInstances] = useState<any[]>([]); // State for product instances
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for API call
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state for editing
    const [editFormData, setEditFormData] = useState<any>({}); // Form data for editing

    // Fetch product instances from API
    useEffect(() => {
        if (!viewProductTypes) {
            setIsLoading(true); // Set loading state to true
            axios
                .get('http://127.0.0.1:3000/v1/productinstance')
                .then((response) => {
                    if (response.data.code === 200) {
                        setProductInstances(response.data.data); // Set product instances
                    } else {
                        console.error('Failed to fetch product instances');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product instances:', error);
                })
                .finally(() => {
                    setIsLoading(false); // Set loading state to false after API call completes
                });
        } else {
            setProductInstances([]); // Clear product instances when switching to product types
        }
    }, [viewProductTypes]);

    // Fetch product types from API
    useEffect(() => {
        if (viewProductTypes) {
            setIsLoading(true); // Set loading state to true
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
                    setIsLoading(false); // Set loading state to false after API call completes
                });
        } else {
            setProductTypes([]); // Clear product types when switching back to products
        }
    }, [viewProductTypes]);

    // Function to handle item click (product or product type)
    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setShowFullDescription(false);
    };

    // Function to open the edit modal
    const handleEditClick = () => {
        setEditFormData(selectedItem); // Populate the form with the selected item's data
        onOpen(); // Open the modal
    };

    // Function to handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    // Function to handle archive toggle in the modal
    const handleArchiveToggleInModal = () => {
        setEditFormData({
            ...editFormData,
            archived: !editFormData.archived,
        });
    };

    // Function to save changes
    const handleSaveChanges = () => {
        axios
            .put(`http://127.0.0.1:3000/v1/product_type/${editFormData.ID}`, editFormData)
            .then((response) => {
                if (response.data.code === 200) {
                    // Update the selected item and product types list
                    setSelectedItem(editFormData);
                    setProductTypes((prev) =>
                        prev.map((item) => (item.ID === editFormData.ID ? editFormData : item))
                    );
                    onClose(); // Close the modal
                } else {
                    console.error('Failed to update product type');
                }
            })
            .catch((error) => {
                console.error('Error updating product type:', error);
            });
    };

    // Base box styling for containers
    const boxStyles = {
        border: '1px solid',
        borderColor: 'gray.200',
        p: '20px',
        borderRadius: '8px',
        boxShadow: 'md',
        bg: 'white',
    };

    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Flex justify="space-between" align="center" mb="20px">
                {/* Title and Toggle */}
                <Text fontSize="2xl" fontWeight="bold">
                    {viewProductTypes ? 'Product Types' : 'Products'}
                </Text>
                <Flex align="center">
                    <Text mr="10px">View Product Types</Text>
                    <Switch
                        isChecked={viewProductTypes}
                        onChange={() => {
                            setViewProductTypes(!viewProductTypes);
                            setSelectedItem(null); // Reset the selected item when switching
                        }}
                    />
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
                {/* Left Box with Table */}
                <Box {...boxStyles}>
                    {viewProductTypes ? (
                        isLoading ? ( // Show spinner while loading
                            <Flex justify="center" align="center" h="200px">
                                <Spinner size="xl" />
                            </Flex>
                        ) : (
                            <ProductTypeTable
                                tableData={productTypes}
                                onProductClick={handleItemClick}
                            />
                        )
                    ) : (
                        <DevelopmentTable
                            tableData={productInstances}
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
                                {/* Edit Icon */}
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

                                {/* Item Image */}
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

                                {/* Item Name */}
                                <Text fontSize="lg" fontWeight="bold">
                                    {selectedItem.title}
                                </Text>

                                {/* Short Description */}
                                <Text color="gray.600" fontSize="md">
                                    {selectedItem.short_description || 'No short description available.'}
                                </Text>

                                {/* Expandable Long Description */}
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

                                {/* Item Status */}
                                <Flex align="center" justify="center">
                                    <Tag
                                        size="lg"
                                        colorScheme={selectedItem.archived ? 'red' : 'green'}
                                    >
                                        {selectedItem.archived ? 'Archived' : 'Active'}
                                    </Tag>
                                    <Tooltip label="Current status of the item" fontSize="sm">
                                        <InfoIcon ml="8px" color="gray.500" />
                                    </Tooltip>
                                </Flex>

                                {/* Additional Fields */}
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
                    <ModalHeader>Edit Product Type</ModalHeader>
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
                            <FormLabel>Archive Status</FormLabel>
                            <Flex align="center">
                                <Text mr="10px" fontSize="sm" color="gray.500">
                                    {editFormData.archived ? 'Archived' : 'Active'}
                                </Text>
                                <Switch
                                    isChecked={!editFormData.archived}
                                    onChange={handleArchiveToggleInModal}
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
        </Box>
    );
}
