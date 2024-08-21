/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
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
  Divider,
  Spacer,
  DrawerFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaInfoCircle,
  FaInstagram,
  FaBars,
  FaSignOutAlt,
  FaPlaneArrival,
  FaTable,
  FaTools,
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
        {/* Menu Button on the Left */}
        <IconButton
          icon={<FaBars />}
          variant="outline"
          color="white"
          onClick={onOpen}
          aria-label="Open Menu"
          mr={4} // Adds margin to the right of the button
        />

        {/* {!isSmallScreen && (
          <Heading
            size="lg"
            cursor="pointer"
            onClick={() => navigate("/")}
            _hover={{ textDecoration: "underline" }}
          >
            Esquadra 502 - Elefantes
          </Heading>
        )} */}
        {/* Centered Heading */}
        <Flex flex="1" justify="center">
          <Heading
            size="lg"
            cursor="pointer"
            textAlign={"center"}
            onClick={() => navigate("/")}
          >
            Sistema Integrado de Qualificações
          </Heading>
        </Flex>
        {/* Drawer for Menu Items */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              {!token ? (
                //Drawer render if logged in
                <>
                  <DrawerHeader>
                    <Heading
                      size="md"
                      fontSize={"16"}
                      color="teal.500"
                      mt="10"
                      cursor="pointer"
                      onClick={() => {
                        navigate("/");
                        onClose();
                      }}
                    >
                      Bem-vindo,
                    </Heading>
                    <Heading
                      size="md"
                      mt="0"
                      color={"teal.500"}
                      cursor="pointer"
                      onClick={() => {
                        navigate("/");
                        onClose();
                      }}
                    >
                      Maj Pedro Andrade
                    </Heading>
                  </DrawerHeader>
                  <DrawerBody>
                    <VStack align="flex-start" h="100%">
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/");
                          onClose();
                        }}
                        aria-label="Voos"
                      >
                        <Flex align="center">
                          <FaPlaneArrival />
                          <Box ml={2}>Voos</Box>
                        </Flex>
                      </ChakraLink>
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/");
                          onClose();
                        }}
                        aria-label="Qualificações"
                      >
                        <Flex align="center">
                          <FaTable />
                          <Box ml={2}>Qualificações</Box>
                        </Flex>
                      </ChakraLink>
                      <Spacer />
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/");
                          onClose();
                        }}
                        aria-label="Definições"
                      >
                        <Flex align="center">
                          <FaTools />
                          <Box ml={2}>Definições</Box>
                        </Flex>
                      </ChakraLink>
                      {/* Horizontal line above Logout */}
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          handleLogout();
                          onClose();
                        }}
                        aria-label="Logout"
                      >
                        <Flex align={"center"}>
                          <FaSignOutAlt /> <Box ml={2}>Logout</Box>
                        </Flex>
                      </ChakraLink>
                      <Divider borderWidth="1px" borderColor={"teal.500"} />
                    </VStack>
                  </DrawerBody>
                </>
              ) : (
                //Drawer render if not logged in

                <>
                  <DrawerHeader>
                    <Heading
                      size="sm"
                      fontSize="sm"
                      color="teal.500"
                      mt="10"
                      textAlign="center"
                    >
                      Por favor efetue o seu login
                    </Heading>
                  </DrawerHeader>
                  <DrawerBody></DrawerBody>
                </>
              )}

              <DrawerFooter>
                <Flex
                  direction="row"
                  textAlign={"center"}
                  justify={"center"}
                  align="center"
                  w="100%"
                >
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
                    <Flex align="center">
                      <FaInfoCircle />
                      <Box ml={2}>About</Box>
                    </Flex>
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
                    <Flex align="center">
                      <FaInstagram />
                      <Box ml={2}>Instagram</Box>
                    </Flex>
                  </ChakraLink>
                </Flex>
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
        {/* {!isSmallScreen ? (
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
        )} */}
      </Flex>
    </Box>
  );
}

export default Header;
