/* eslint-disable react/prop-types */
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useState } from "react";

function RecoverProcess() {
  let params = useParams();
  console.log(params);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast(); // Initialize the toast hook

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const setnewpass = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        description:
          "Please ensure that the new password and confirmation match.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const loadingToast = toast({
      title: "Processing request...",
      description: "Please wait while we process your request.",
      status: "loading",
      isClosable: true,
    });

    try {
      // Update the API endpoint and payload
      await axios.post("/api/storenewpass", {
        newpass: newPassword,
      });

      toast.close(loadingToast);

      toast({
        title: "Password updated.",
        description: "Your password has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast.close(loadingToast);

      toast({
        title: "Error.",
        description: "Failed to update the password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      w="100vw"
      h="70vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      mt="0px" // Adjust padding top as needed
    >
      <Box mb={[0, 15]}>
        {" "}
        {/* Smaller margin-bottom for small screens */}
        <Heading
          pt={20}
          pb={10}
          textAlign={"center"}
          fontSize={["2xl", "2xl", "3xl"]}
        >
          {" "}
          {/* Responsive font size */}
          Sistema Integrado de Qualificações
        </Heading>
      </Box>
      <Stack
        spacing={[4, 6]} // Smaller spacing for small screens
        textAlign="center"
        width="100%"
        maxWidth="md"
        alignItems="center" // Center the Stack items horizontally
      >
        <FormControl mt={4}>
          <FormLabel textAlign="center">New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            name="newPassword"
            placeholder="New Password"
            onChange={handleChangeNewPassword}
            aria-label="New Password"
            width={["80%", "60%", "100%"]} // Adjust input width for small screens and larger screens
            mx="auto" // Center the input field
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel textAlign="center">Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChangeConfirmPassword}
            aria-label="Confirm Password"
            width={["80%", "60%", "100%"]} // Adjust input width for small screens and larger screens
            mx="auto" // Center the input field
          />
        </FormControl>

        <Button
          mt={6}
          colorScheme="teal"
          onClick={setnewpass}
          aria-label="Recover"
          width={["80%", "60%", "100%"]} // Adjust button width for small screens and larger screens
          mx="auto" // Center the button
        >
          Guardar
        </Button>
      </Stack>
      <Box
        position={"fixed"}
        bottom={0}
        w="100%"
        bg="gray.300"
        py="3"
        alignItems={"center"}
      ></Box>
    </Box>
  );
}

export default RecoverProcess;
