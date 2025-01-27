import React, { useState, useEffect } from 'react';
import {
    Box,
    SimpleGrid,
    Text,
    Icon,
    Switch,
    Flex,
    Image,
    VStack,
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
    useToast,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FiImage } from 'react-icons/fi';
import axios from 'axios';

// Define TypeScript interfaces
interface ProductType {
    ID: number;
    title: string;
    short_description: string;
    long_description: string;
    image_url: string;
    transparent_image: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

interface ProductInstance {
    ID: number;
    title: string;
    short_description: string;
    long_description: string;
    image_url: string;
    transparent_image: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export default function Settings() {
    const [selectedItem, setSelectedItem] = useState<ProductType | ProductInstance | null>(null);
    const [viewProductTypes, setViewProductTypes] = useState<boolean>(false);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [productInstances, setProductInstances] = useState<ProductInstance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
    const [editFormData, setEditFormData] = useState<ProductType | ProductInstance | null>(null);
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

    const toast = useToast();

    // Fetch product instances or types based on view
    useEffect(() => {
        setIsLoading(true);
        const url = viewProductTypes
            ? 'http://127.0.0.1:3000/v1/producttype'
            : 'http://127.0.0.1:3000/v1/productinstance';

        axios
            .get(url)
            .then((response) => {
                if (response.data.code === 200) {
                    if (viewProductTypes) {
                        setProductTypes(response.data.data);
                    } else {
                        setProductInstances(response.data.data);
                    }
                } else {
                    toast({
                        title: 'Error',
                        description: 'Failed to fetch data',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                toast({
                    title: 'Error',
                    description: 'Error fetching data',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [viewProductTypes, toast]);

    // Handle item click (product or product type)
    const handleItemClick = (item: ProductType | ProductInstance) => {
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
        } as ProductType | ProductInstance);
    };

    // Save changes in the edit modal
    const handleSaveChanges = async () => {
        if (!editFormData) return;

        setIsLoading(true);
        const url = viewProductTypes
            ? `http://127.0.0.1:3000/v1/producttype/${editFormData.ID}`
            : `http://127.0.0.1:3000/v1/productinstance/${editFormData.ID}`;

        try {
            const response = await axios.put(url, editFormData);
            if (response.data.code === 200) {
                setSelectedItem(editFormData);
                if (viewProductTypes) {
                    setProductTypes((prev) =>
                        prev.map((item) => (item.ID === editFormData.ID ? editFormData : item))
                    );
                } else {
                    setProductInstances((prev) =>
                        prev.map((item) => (item.ID === editFormData.ID ? editFormData : item))
                    );
                }
                onClose();
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error updating item',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
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

    // Add a new item (product or product type)
    const handleAddItem = async () => {
        setIsLoading(true);
        const url = viewProductTypes
            ? 'http://127.0.0.1:3000/v1/producttype'
            : 'http://127.0.0.1:3000/v1/productinstance';

        try {
            const response = await axios.post(url, addFormData);
            if (response.status === 201) {
                const newItem = response.data.data || response.data;
                if (viewProductTypes) {
                    setProductTypes((prev) => [...prev, newItem]);
                } else {
                    setProductInstances((prev) => [...prev, newItem]);
                }
                setSelectedItem(newItem);
                onCloseAddModal();
                setAddFormData({
                    title: '',
                    short_description: '',
                    long_description: '',
                    image_url: '',
                    transparent_image: false,
                });
            } else {
                throw new Error('Failed to add item');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error adding item',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = viewProductTypes
        ? productTypes.slice(indexOfFirstItem, indexOfLastItem)
        : productInstances.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
                    <Button colorScheme="blue" ml="10px" onClick={onOpenAddModal}>
                        {viewProductTypes ? 'Add Product Type' : 'Add Product'}
                    </Button>
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
                {/* Left Box with Table */}
                <Box {...boxStyles}>
                    {isLoading ? (
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
                                {Array.from(
                                    { length: Math.ceil((viewProductTypes ? productTypes : productInstances).length / itemsPerPage) },
                                    (_, i) => (
                                        <Button
                                            key={i + 1}
                                            variant={currentPage === i + 1 ? 'solid' : 'outline'}
                                            colorScheme="blue"
                                            mx="1"
                                            onClick={() => paginate(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    )
                                )}
                            </Flex>
                        </>
                    )}
                </Box>

                {/* Right Box with Details */}
                <Box
                    {...boxStyles}
                    textAlign="center"
                    _hover={{ boxShadow: 'xl', transform: 'scale(1.02)', transition: '0.3s ease' }}
                >
                    {selectedItem ? (
                        <VStack spacing={4}>
                            <Flex justify="flex-end" w="full">
                                <Icon
                                    as={EditIcon}
                                    boxSize="5"
                                    color="gray.500"
                                    cursor="pointer"
                                    _hover={{ color: 'blue.500' }}
                                    onClick={handleEditClick}
                                    aria-label="Edit item"
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
                                value={editFormData?.title || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Short Description</FormLabel>
                            <Input
                                name="short_description"
                                value={editFormData?.short_description || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Long Description</FormLabel>
                            <Textarea
                                name="long_description"
                                value={editFormData?.long_description || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                                name="image_url"
                                value={editFormData?.image_url || ''}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Transparent Image</FormLabel>
                            <Flex align="center">
                                <Text mr="10px" fontSize="sm" color="gray.500">
                                    {editFormData?.transparent_image ? 'Yes' : 'No'}
                                </Text>
                                <Switch
                                    isChecked={editFormData?.transparent_image || false}
                                    onChange={() =>
                                        setEditFormData({
                                            ...editFormData,
                                            transparent_image: !editFormData?.transparent_image,
                                        } as ProductType | ProductInstance)
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
                        <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
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