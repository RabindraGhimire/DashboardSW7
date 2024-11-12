import React, { useState } from 'react';
import { Box, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment';

// Main component
export default function Settings() {
	const [selectedProduct, setSelectedProduct] = useState<any>(null);

	// Function to handle product click
	const handleProductClick = (product: any) => {
		setSelectedProduct(product);
	};

	// Base box styling for both containers
	const boxStyles = {
		border: "1px solid",
		borderColor: "gray.200",
		p: "20px",
		borderRadius: "8px",
		boxShadow: "md",
		bg: "white",
	};

	// Styling for the inner content to match the DevelopmentTable row styles
	const innerBoxStyles = {
		bg: useColorModeValue("gray.50", "gray.700"),  // Matching light or dark mode background
		p: "16px",
		borderRadius: "8px",
		boxShadow: "sm",
		border: "1px solid",
		borderColor: "gray.200",
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

				{/* Right Box with Product Details */}
				<Box {...boxStyles}>
					{selectedProduct ? (
						<Box {...innerBoxStyles}>
							<Text fontSize="2xl" fontWeight="bold">
								{selectedProduct.name}
							</Text>
							<Text mt="10px">Tech: {selectedProduct.status}</Text>
							<Text mt="10px">Manufacture Date: {selectedProduct.date}</Text>
							<Text mt="10px">Progress: {selectedProduct.progress}%</Text>
						</Box>
					) : (
						<Box {...innerBoxStyles}>
							<Text>Select a product to see details</Text>
						</Box>
					)}
				</Box>
			</SimpleGrid>
		</Box>
	);
}
