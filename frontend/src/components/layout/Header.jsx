/* eslint-disable react/prop-types */
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
  VStack,
  Divider,
  Spacer,
  DrawerFooter,
  useColorMode,
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
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { LuSun } from "react-icons/lu";
import { IoMoon } from "react-icons/io5";

function Header() {
  const { token, removeToken, getUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  // const [isSmallScreen] = useMediaQuery("(max-width: 480px)");
  // if (token) {
  //   const { getUser, admin } = getUser();
  // }
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
          {/* Right Side*/}
        </Flex>
        <Flex alignItems={"right"} display={{ base: "md" }}>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun />}
          </Button>
        </Flex>
        {/* Drawer for Menu Items */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              {token ? (
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
                      {/* {getUser + (admin ? "YES" : "NO")} */}
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

                      {/* {admin ? ( */}
                      <ChakraLink
                        p={2}
                        color="teal.500"
                        fontSize="lg"
                        onClick={() => {
                          navigate("/users");
                          onClose();
                        }}
                      >
                        <Flex align="center">
                          <FaTools />

                          <Box ml={2}>Utilizadores</Box>
                        </Flex>
                      </ChakraLink>
                      {/* ) : null} */}

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
                      {/* Horizontal line above Logout */}
                      <Divider borderWidth="1px" borderColor={"teal.500"} />
                    </VStack>
                  </DrawerBody>
                </>
              ) : (
                //Drawer render if not logged in

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
      </Flex>
    </Box>
  );
}

export default Header;
