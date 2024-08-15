// Footer.jsx
import React from 'react';
import { Box, Text, Stack, Divider, Link as ChakraLink } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import social media icons

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
      borderRadius="md"
      boxShadow="lg"
      position="fixed"
      bottom={0}
    >
      <Text mb={1} fontSize="lg" fontWeight="bold">
        Esquadra 502 @ 2024
      </Text>
      {/* <Divider borderColor="whiteAlpha.600" my={4} />
      <Stack direction="row" spacing={4} justify="center" mb={4}>
        <ChakraLink href="https://www.facebook.com/Esquadra502/" isExternal>
          <FaFacebook size={24} />
        </ChakraLink>
        <ChakraLink href="https://www.instagram.com/esquadra502/" isExternal>
          <FaInstagram size={24} />
        </ChakraLink>
      </Stack> */}
  </Box>
  );
}

export default Footer;
