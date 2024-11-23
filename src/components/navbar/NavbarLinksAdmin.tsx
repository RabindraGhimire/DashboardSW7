// Chakra Imports
import {
	Avatar,
	Button,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

interface HeaderLinksProps {
	secondary: boolean;
	onOpen: () => void; 
	fixed:boolean;
}

export default function HeaderLinks({ onOpen, secondary, fixed }: HeaderLinksProps) {
	const { colorMode, toggleColorMode } = useColorMode();
	const navigate = useNavigate();

	// Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	const menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);

	// State to store the username
	const [username, setUsername] = useState<string>('User');

	// Fetch username (example from localStorage)
	useEffect(() => {
		const storedUsername = localStorage.getItem('username') || 'User';
		setUsername(storedUsername);
	}, []);

	// Handle Log Out
	const handleLogOut = () => {
		localStorage.removeItem('token'); // Remove authentication token
		localStorage.removeItem('username'); // Optional: Remove username
		navigate('/auth/sign-in'); // Redirect to login page
	};

	// Navigate to profile settings
	const handleProfileSettings = () => {
		navigate('/admin/profile');
	};

	return (
		<Flex
			w={{ sm: '100%', md: 'auto' }}
			alignItems="center"
			flexDirection="row"
			bg={menuBg}
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p="10px"
			borderRadius="30px"
			boxShadow={shadow}
		>
			<Menu>
				<MenuButton p="0px">
					<Avatar
						_hover={{ cursor: 'pointer' }}
						color="white"
						name={username}
						bg="#11047A"
						size="sm"
						w="40px"
						h="40px"
					/>
				</MenuButton>
				<MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
					<Flex w="100%" mb="0px">
						<Text
							ps="20px"
							pt="16px"
							pb="10px"
							w="100%"
							borderBottom="1px solid"
							borderColor={borderColor}
							fontSize="sm"
							fontWeight="700"
							color={textColor}
						>
							👋&nbsp; Hey, {username}
						</Text>
					</Flex>
					<Flex flexDirection="column" p="10px">
						<MenuItem
							_hover={{ bg: 'none' }}
							_focus={{ bg: 'none' }}
							borderRadius="8px"
							px="14px"
							onClick={handleProfileSettings}
						>
							<Text fontSize="sm">Profile Settings</Text>
						</MenuItem>
						<MenuItem
							_hover={{ bg: 'none' }}
							_focus={{ bg: 'none' }}
							color="red.400"
							borderRadius="8px"
							px="14px"
							onClick={handleLogOut}
						>
							<Text fontSize="sm">Log out</Text>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
			{/* <Button
				variant="no-hover"
				bg="transparent"
				p="0px"
				minW="unset"
				minH="unset"
				h="18px"
				w="max-content"
				onClick={toggleColorMode}
			>
				<Icon
					me="10px"
					h="18px"
					w="18px"
					color={navbarIcon}
					as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
				/>
			</Button> */}
			{/* Example button to demonstrate onOpen functionality */}
			{/* <Button size="sm" ml="4" onClick={onOpen}>
				Open Sidebar
			</Button> */}
		</Flex>
	);
}
