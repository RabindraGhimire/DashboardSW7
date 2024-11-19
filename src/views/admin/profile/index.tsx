import React, { useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Switch,
  VStack,
} from '@chakra-ui/react';

export default function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({
    name: 'Adela Parkson',
    email: 'adela.parkson@example.com',
    job: 'Product Designer',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  // Handlers
  const handleProfileChange = (e:any) =>
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });

  const handlePasswordChange = (e:any) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleNotificationChange = (e:any) =>
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });

  return (
    <Box p="20px" pt={{ base: '130px', md: '100px' }} bg="gray.50" minH="100vh">
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={6}
        mb="40px"
      >
        {/* Profile Information */}
        <Box bg="white" p="20px" borderRadius="8px" shadow="md">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Profile Information
          </Text>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={profileInfo.name}
                onChange={handleProfileChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={profileInfo.email}
                onChange={handleProfileChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="job"
                value={profileInfo.job}
                onChange={handleProfileChange}
              />
            </FormControl>
            <Button colorScheme="blue" width="full">
              Save Changes
            </Button>
          </VStack>
        </Box>

        {/* Change Password */}
        <Box bg="white" p="20px" borderRadius="8px" shadow="md">
          <Text fontSize="lg" fontWeight="bold" mb="4">
            Change Password
          </Text>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
              />
            </FormControl>
            <Button colorScheme="blue" width="full">
              Update Password
            </Button>
          </VStack>
        </Box>
      </Grid>

      {/* Notification Settings */}
      <Box bg="white" p="20px" borderRadius="8px" shadow="md">
        <Text fontSize="lg" fontWeight="bold" mb="4">
          Notification Settings
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Email Notifications</FormLabel>
            <Switch
              name="emailNotifications"
              isChecked={notifications.emailNotifications}
              onChange={handleNotificationChange}
              colorScheme="blue"
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">SMS Notifications</FormLabel>
            <Switch
              name="smsNotifications"
              isChecked={notifications.smsNotifications}
              onChange={handleNotificationChange}
              colorScheme="blue"
            />
          </FormControl>
          <Button colorScheme="blue" width="full">
            Save Preferences
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
