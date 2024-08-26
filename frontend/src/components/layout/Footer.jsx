// Footer.jsx
import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      w="100%"
      bg="teal.500"
      color="white"
      py={2}
      px={3}
      mt={6}
      textAlign="center"
      // borderRadius="md"
      boxShadow="lg"
      position="fixed"
      bottom={0}
    >
      <Text mb={1} fontSize="lg" fontWeight="bold">
        Esquadra 502 @ 2024
      </Text>
    </Box>
  );
}

export default Footer;
