import React, { useState } from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment';

// Main component
export default function Settings() {
	const [selectedProduct, setSelectedProduct] = useState<any>(null);

	// Function to handle product click
	const handleProductClick = (product: any) => {
		setSelectedProduct(product);
	};

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
				<Box>
					<DevelopmentTable
						tableData={tableDataDevelopment}
						onProductClick={handleProductClick} // Pass the click handler to DevelopmentTable
					/>
				</Box>
				<Box border="1px solid" borderColor="gray.200" p="20px">
					{selectedProduct ? (
						<Box>
							<Text fontSize="2xl" fontWeight="bold">
								{selectedProduct.name}
							</Text>
							<Text mt="10px">Tech: {selectedProduct.status}</Text>
							<Text mt="10px">Manufacture Date: {selectedProduct.date}</Text>
							<Text mt="10px">Progress: {selectedProduct.progress}%</Text>
							{/* Add more details as needed */}
						</Box>
					) : (
						<Text>Select a product to see details</Text>
					)}
				</Box>
			</SimpleGrid>
		</Box>
	);
}
