import { Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

function PasswordChange() {
  const [password, setPassword] = useState("");

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      w="100vw"
      h="100vh"
      bg="whiteAlpha.200"
    >
      <FormControl>
        <FormLabel>Nova Password</FormLabel>
        <Input
          name="password"
          value={password}
          onChange={handleChangePassword}
        />
      </FormControl>
    </Flex>
  );
}

export default PasswordChange;
