// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Text
				fontSize='2xl' // Adjust the font size
				fontWeight='bold' // Make the font bold
				color={logoColor} // Use color based on the color mode
				_hover={{ textDecoration: 'underline', color: 'teal.500' }} // Add hover effect
			>
				RentHub
			</Text>
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
