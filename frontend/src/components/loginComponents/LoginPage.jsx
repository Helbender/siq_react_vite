/* eslint-disable react/prop-types */
import {
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
  Stack,
  Heading,
  Button,
  Link,useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function LoginPage(props) {
  const [loginForm, setloginForm] = useState({
    nip: "",
    password: "",
  });
  const navigate = useNavigate();
  const toast = useToast();
  const navigateRecover = () => navigate("/recover");


  function logMeIn(event) {
    axios({
      method: "POST",
      url: "/api/token",
      data: {
        nip: loginForm.nip,
        password: loginForm.password,
      },
    })
      .then((response) => {
        props.setToken(response.data.access_token);
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response
          ? "Invalid NIP or password."
          : "Unable to reach the server. Please try again later.";
  
        toast({
          title: "Login failed.",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    // setloginForm({
    //   nip: "",
    //   password: "",
    // });

    event.preventDefault();
  }
  function handleChange(event) {
    const { value, name } = event.target;
    setloginForm((prev) => ({ ...prev, [name]: value }));
  }
  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack>
        <Heading mb={"25px"}>Esquadra 502</Heading>
        <FormControl>
          <FormLabel textAlign={"center"}>NIP</FormLabel>
          <Input
            type="text"
            value={loginForm.nip}
            name="nip"
            placeholder="NIP"
            onChange={handleChange}
          />
        </FormControl>

        <FormControl mt="2">
          <FormLabel textAlign={"center"}>Password</FormLabel>
          <Input
            type="password"
            value={loginForm.password}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </FormControl>
        <Link
          mt={4}
          color="teal.500"
          fontWeight="bold"
          onClick={navigateRecover}
          aria-label="Recover Password"
          width={["80%", "60%", "100%"]} // Adjust link width for small screens and larger screens
          textAlign="center"
        >
          Recover Password
        </Link>
        <Button mt="10" onClick={logMeIn}>
          Login
        </Button>
      </Stack>
      {/* <Box 
        position={"fixed"}
        bottom={0}
        w="100%"
        bg="gray.300"
        py="3"
        alignItems={"center"}
      >
        <Text textAlign={"center"} color={"black"}>
          Esquadra 502 @ 2024
        </Text>
      </Box>
          */}
    </Box>
  );
}

export default LoginPage;
