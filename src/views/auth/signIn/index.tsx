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
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye, MdLogin, MdPerson } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { FaGoogle, FaFacebook } from "react-icons/fa"; // For social icons
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Username and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
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
        localStorage.setItem("token", data.token);
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/admin/default");
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bgGradient="linear(to-br, blue.600, purple.500)" // Gradient background
      p={4}
    >
      <Box
        w="100%"
        maxW={{ base: "90%", md: "400px" }} // Responsive width
        bg="white"
        p={6}
        boxShadow="md"
        borderRadius="md"
      >
        {/* Heading with User Icon */}
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          mb={2}
          bg="#0E1DB0"
          color="white"
          p={3}
          borderRadius="md"
        >
          <Flex align="center" justify="center">
            <Icon as={MdPerson} boxSize={6} mr={2} />
            Sign In
          </Flex>
        </Heading>
        {/* Subtext */}
        <Text color="gray.500" textAlign="center" mb={6}>
          Welcome back! Please sign in to your account.
        </Text>

        {/* Username Input */}
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            aria-label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            focusBorderColor="#0E1DB0"
            bg="gray.50"
            _focus={{ bg: "white", boxShadow: "0 0 0 2px #0E1DB0" }}
          />
        </FormControl>

        {/* Password Input */}
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="#0E1DB0"
              bg="gray.50"
              _focus={{ bg: "white", boxShadow: "0 0 0 2px #0E1DB0" }}
            />
            <InputRightElement>
              <Tooltip label={showPassword ? "Hide password" : "Show password"}>
                <Icon
                  as={showPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  cursor="pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Remember Me and Forgot Password Links */}
        <Flex align="center" justify="space-between" mb={4}>
          <Checkbox>Remember me</Checkbox>
          <Link href="/auth/forgot-password" color="#0E1DB0">
            Forgot password?
          </Link>
        </Flex>

        {/* Sign In Button with Icon */}
        <Button
          w="100%"
          onClick={handleSignIn}
          bg="#0E1DB0"
          color="white"
          _hover={{ bg: "#0C199A", transform: "scale(1.02)", boxShadow: "lg" }}
          _active={{ bg: "#0A157D" }}
          isLoading={isLoading}
          leftIcon={<Icon as={MdLogin} />}
        >
          Sign In
        </Button>

        {/* Social Sign-In Options */}
        <Flex direction="column" gap={3} mt={6}>
          <Button colorScheme="red" leftIcon={<Icon as={FaGoogle} />}>
            Sign in with Google
          </Button>
          <Button colorScheme="blue" leftIcon={<Icon as={FaFacebook} />}>
            Sign in with Facebook
          </Button>
        </Flex>

        {/* Sign Up Link */}
        <Text textAlign="center" mt={4}>
          Not registered yet?{" "}
          <Link href="/auth/sign-up" color="#0E1DB0">
            Create an Account
          </Link>
        </Text>

        {/* Footer */}
        <Text mt={6} fontSize="sm" textAlign="center" color="gray.500">
          By signing in, you agree to our{" "}
          <Link href="/terms" color="#0E1DB0">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" color="#0E1DB0">
            Privacy Policy
          </Link>.
        </Text>
      </Box>
    </Flex>
  );
}

export default SignIn;
