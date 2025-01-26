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
    Progress,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { FiImage } from 'react-icons/fi';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable'; // Assuming this component exists
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment'; // Products data
import ProductTypeTable from './components/ProductTypeTable';
import axios from 'axios';

export default function Settings() {
    const [selectedItem, setSelectedItem] = useState<any>(null); // Tracks the selected product or product type
    const [viewProductTypes, setViewProductTypes] = useState<boolean>(false); // Toggle for table view
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false); // State for description toggle
    const [productTypes, setProductTypes] = useState<any[]>([]); // State for product types

    // Fetch product types from API
    useEffect(() => {
        if (viewProductTypes) {
            axios
                .get('http://127.0.0.1:3000/v1/product_type')
                .then((response) => {
                    if (response.data.code === 200) {
                        setProductTypes(response.data.data);
                    } else {
                        console.error('Failed to fetch product types');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product types:', error);
                });
        }
    }, [viewProductTypes]);

    // Function to handle item click (product or product type)
    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setShowFullDescription(false);
    };

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
                        <ProductTypeTable
                            tableData={productTypes}
                            onProductClick={handleItemClick}
                        />
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

                                {/* Expandable Description */}
                                <Box textAlign="left" w="full">
                                    <Collapse startingHeight={60} in={showFullDescription}>
                                        <Text color="gray.600" fontSize="md">
                                            {selectedItem.long_description || 'No description available.'}
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
                            </VStack>
                        </Fade>
                    ) : (
                        <Text color="gray.500">
                            Select a {viewProductTypes ? 'product type' : 'product'} to see its details here.
                        </Text>
                    )}
                </Box>
            </SimpleGrid>
        </Box>
    );
}
