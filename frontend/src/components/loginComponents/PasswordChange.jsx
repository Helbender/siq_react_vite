import { Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function PasswordChange() {
  const [password, setPassword] = useState("");
  let params = useParams();
  console.log(params);

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

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
