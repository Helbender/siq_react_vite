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
  Spacer,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

function LoginPage(props) {
  const [loginForm, setloginForm] = useState({
    nip: "",
    password: "",
  });

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
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    setloginForm({
      nip: "",
      password: "",
    });

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
        <Link textAlign={"center"} mt="5">
          Recover Password
        </Link>
        <Button mt="10" onClick={logMeIn}>
          Login
        </Button>
      </Stack>
      <Box
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
    </Box>
  );
}

export default LoginPage;
