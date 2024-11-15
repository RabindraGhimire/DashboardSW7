import React, { useState } from 'react';
import { Box, SimpleGrid, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useColorModeValue } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment';

// Function to calculate a dummy availability date (e.g., 30 days from today)
const getAvailabilityDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30); // Set 30 days in the future
    return today.toLocaleDateString();   // Format the date as a string
};

// Main component
export default function Settings() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [canOrder, setCanOrder] = useState<boolean>(false);

    // Function to handle product click
    const handleProductClick = (product: any) => {
        setSelectedProduct(product);

        // Check if the product is ready to order
        if (product.status === 'Ready to Order') {
            setCanOrder(true);  // Enable ordering
        } else {
            setCanOrder(false); // Show status-only message
        }
        onOpen(); // Open the modal in either case
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
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
                {/* Left Box with Development Table */}
                <Box {...boxStyles}>
                    <DevelopmentTable
                        tableData={tableDataDevelopment}
                        onProductClick={handleProductClick}
                    />
                </Box>

                {/* Right Box with Instructions */}
                <Box {...boxStyles}>
                    <Text>Select a product from the table to see more details and place an order.</Text>
                </Box>
            </SimpleGrid>

            {/* Modal for Product Details or Status Message */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedProduct?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {canOrder ? (
                            // Display product details if the product is "Ready to Order"
                            <>
                                <Text>Tech: {selectedProduct?.status}</Text>
                                <Text mt="10px">Manufacture Date: {selectedProduct?.date}</Text>
                                <Text mt="10px">Progress: {selectedProduct?.progress}%</Text>
                                <Text mt="10px">Description: {selectedProduct?.description}</Text>
                            </>
                        ) : (
                            // Display a message based on the product status
                            <>
                                <Text>This item cannot be ordered.</Text>
                                <Text mt="10px">Current Status: {selectedProduct?.status}</Text>
                                {(selectedProduct?.status === 'Occupied' || selectedProduct?.status === 'In Repair') && (
                                    <Text mt="10px">
                                        This item will be available to order on: <strong>{getAvailabilityDate()}</strong>
                                    </Text>
                                )}
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {canOrder ? (
                            <Button colorScheme="blue" mr={3} onClick={() => alert('Order placed!')}>
                                Order
                            </Button>
                        ) : null}
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
