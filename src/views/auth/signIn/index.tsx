import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Use useNavigate instead of history

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Save token to localStorage
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/admin/default"); // Navigate to the dashboard
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
      p={4}
    >
      <Box
        w="100%"
        maxW="400px"
        bg="white"
        p={6}
        boxShadow="md"
        borderRadius="md"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Sign In
        </Heading>

        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Icon
                as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                cursor="pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Flex align="center" justify="space-between" mb={4}>
          <Checkbox>Remember me</Checkbox>
          <Link href="/auth/forgot-password" color="blue.500">
            Forgot password?
          </Link>
        </Flex>

        <Button w="100%" onClick={handleSignIn}>
          Sign In
        </Button>

        <Text textAlign="center" mt={4}>
          Not registered yet?{" "}
          <Link href="/auth/sign-up" color="blue.500">
            Create an Account
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default SignIn;
