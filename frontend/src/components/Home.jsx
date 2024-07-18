import { Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Text
      bgGradient={"linear(to-r, cyan.400, blue.500)"}
      bgClip={"text"}
      fontSize={"50"}
      fontWeight={"bold"}
      align={"center"}
    >
      Home
    </Text>
  );
}
