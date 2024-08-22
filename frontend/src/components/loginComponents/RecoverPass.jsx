import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendEmail } from './useSendEmail'; // Import the custom hook

function RecoverPass() {
  const [email, setEmail] = useState("");
  const sendEmail = useSendEmail(); // Use the custom hook
  const navigate = useNavigate();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRecover = async () => {
    const success = await sendEmail(email, `/api/recover/${email}`);
    if (success) {
      navigate("/");
    }
  };

  const goBack = () => navigate("/");

  return (
    <Box
      w={"100vw"}
      h={"70vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack mb={{ base: "10", md: "25" }} textAlign={"center"}>
        <Heading textAlign={"center"} my={10} fontSize={["xl", "2xl", "3xl"]}>
          Sistema Integrado de Qualificações
        </Heading>
        <FormControl mx="auto">
          <FormLabel textAlign={"center"}>Email</FormLabel>
          <Input
            type="email"
            value={email}
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            aria-label="Email input"
            mx="auto" // Center the input field
            width={["60", "80%", "100%"]} // Adjust input width for small screens and larger screens
          />
        </FormControl>

        <Button
          mt={5}
          colorScheme="teal"
          onClick={handleRecover} // Use the new handler
          width={["60%", "80%", "100%"]} // Adjust button width for small screens and larger screens
          mx="auto" // Center the button
        >
          Recover
        </Button>
        <Button
          onClick={goBack}
          width={["60%", "80%", "100%"]} // Adjust button width for small screens and larger screens
          mx="auto" // Center the button
        >
          Go Back
        </Button>
      </Stack>
    </Box>
  );
}

export default RecoverPass;
