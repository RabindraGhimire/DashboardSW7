import React, { useState } from 'react';
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
import { FiImage } from 'react-icons/fi'; // Icon for placeholder image
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable'; // Assuming this component exists and can handle the products
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment'; // Your data

export default function Settings() {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [viewProductTypes, setViewProductTypes] = useState<boolean>(false);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false); // State for description toggle

    // Function to handle product click
    const handleProductClick = (product: any) => {
        setSelectedProduct(product); // Update state with the selected product
        setShowFullDescription(false); // Reset description toggle
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
                {/* <Text fontSize="2xl" fontWeight="bold">
                    {viewProductTypes ? 'Product Types' : 'Products'}
                </Text> */}
                <Flex align="center">
                    <Text mr="10px">View Product Types</Text>
                    <Switch
                        isChecked={viewProductTypes}
                        onChange={() => setViewProductTypes(!viewProductTypes)}
                    />
                </Flex>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
                {/* Left Box with Product List */}
                <Box {...boxStyles}>
                    {/* Product Table */}
                    <DevelopmentTable
                        tableData={tableDataDevelopment} // Pass all the products (no pagination logic)
                        onProductClick={handleProductClick}
                    />
                </Box>

                {/* Right Box with Product Details */}
                <Box
                    {...boxStyles}
                    textAlign="center"
                    _hover={{ boxShadow: 'xl', transform: 'scale(1.02)', transition: '0.3s ease' }}
                >
                    {selectedProduct ? (
                        <Fade in={!!selectedProduct}>
                            <VStack spacing={4}>
                                {/* Product Image */}
                                {selectedProduct.image ? (
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
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

                                {/* Product Name */}
                                <Text fontSize="lg" fontWeight="bold">
                                    {selectedProduct.name}
                                </Text>

                                {/* Expandable Description */}
                                <Box textAlign="left" w="full">
                                    <Collapse startingHeight={40} in={showFullDescription}>
                                        <Text color="gray.600" fontSize="md">
                                            {selectedProduct.description || 'No description available.'}
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

                                {/* Progress Bar */}
                                {selectedProduct.progress !== undefined && (
                                    <Box w="full" textAlign="left">
                                        <Text fontSize="sm" fontWeight="semibold" mb="2">
                                            Manufacturing Progress:
                                        </Text>
                                        <Progress
                                            value={selectedProduct.progress}
                                            size="sm"
                                            colorScheme="blue"
                                            borderRadius="md"
                                        />
                                    </Box>
                                )}

                                {/* Product Status */}
                                <Flex align="center" justify="center">
                                    <Tag
                                        size="lg"
                                        colorScheme={selectedProduct.status === 'Ready to Order' ? 'green' : selectedProduct.status === 'In Repair' ? 'orange' : 'red'}
                                    >
                                        {selectedProduct.status}
                                    </Tag>
                                    <Tooltip label="Current status of the product" fontSize="sm">
                                        <InfoIcon ml="8px" color="gray.500" />
                                    </Tooltip>
                                </Flex>
                            </VStack>
                        </Fade>
                    ) : (
                        <Text color="gray.500">Select a product to see its details here.</Text>
                    )}
                </Box>
            </SimpleGrid>
        </Box>
    );
}
