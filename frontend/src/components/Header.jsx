/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaInstagram,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

function Header({ token, removeToken }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSmallScreen] = useMediaQuery("(max-width: 480px)");

  function handleLogout() {
    axios({
      method: "POST",
      url: "/api/logout",
    })
      .then(() => {
        removeToken();
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  return (
    <Box
      as="header"
      w="100%"
      bg="teal.500"
      color="white"
      p={4}
      boxShadow="md"
      // position="fixed"
      top={0}
      zIndex={1000}
    >
      <Flex align="center" justify="space-between">
        {!isSmallScreen && (
          <Heading
            size="lg"
            cursor="pointer"
            onClick={() => navigate("/")}
            _hover={{ textDecoration: "underline" }}
          >
            Esquadra 502 - Elefantes
          </Heading>
        )}

        {!isSmallScreen ? (
          <Flex align="center">
            <ChakraLink
              p={2}
              ml={4}
              color="white"
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate("/")}
              aria-label="Home"
            >
              <FaHome size={20} />
            </ChakraLink>
            <ChakraLink
              p={2}
              ml={4}
              color="white"
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
              href="https://www.instagram.com/esquadra502/"
              isExternal
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </ChakraLink>
            <ChakraLink
              p={2}
              ml={4}
              color="white"
              fontSize="lg"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate("/about")}
              aria-label="About"
            >
              <FaInfoCircle size={20} />
            </ChakraLink>
            {!token && token !== "" && token !== undefined ? null : (
              <IconButton
                icon={<FaSignOutAlt />}
                variant="outline"
                color="white"
                onClick={handleLogout}
                aria-label="Logout"
                ml={4}
              />
            )}
          </Flex>
        ) : (
          <>
            <IconButton
              icon={<FaBars />}
              variant="outline"
              color="white"
              onClick={onOpen}
              aria-label="Open Menu"
            />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>
                    <Heading
                      size="md"
                      cursor="pointer"
                      onClick={() => {
                        navigate("/");
                        onClose();
                      }}
                    >
                      Esquadra 502 - Elefantes
                    </Heading>
                  </DrawerHeader>
                  <DrawerBody>
                    <VStack align="flex-start">
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/");
                          onClose();
                        }}
                        aria-label="Home"
                      >
                        <FaHome /> Home
                      </ChakraLink>
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/about");
                          onClose();
                        }}
                        aria-label="About"
                      >
                        <FaInfoCircle /> About
                      </ChakraLink>
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        href="https://www.instagram.com/esquadra502/"
                        isExternal
                        aria-label="Instagram"
                        onClick={onClose}
                      >
                        <FaInstagram /> Instagram
                      </ChakraLink>
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </>
        )}
      </Flex>
    </Box>
  );
}

export default Header;
