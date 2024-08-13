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

function RecoverPass(props) {
  const [email, setEmail] = useState("");

  function sendEmail() {
    axios({ method: "POST", url: `/api/recover/${email}` });
  }
  function handleChange(event) {
    setEmail(event.target.value);
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
          <FormLabel textAlign={"center"}>Email</FormLabel>
          <Input
            type="email"
            value={email}
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </FormControl>

        <Button mt="10" onClick={sendEmail}>
          Recover
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

export default RecoverPass;
