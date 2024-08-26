import { Link } from "react-router-dom";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuSun } from "react-icons/lu";
import { IoMoon } from "react-icons/io5";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  // const location = useLocation();
  return (
    <Container maxW={"800px"} mb={10} mt={20}>
      <Box
        px={5}
        my={4}
        // mx={10}
        borderRadius={10}
        bg={useColorModeValue("gray.400", "gray.700")}
      >
        <Flex h="16" alignItems={"center"} justifyContent={"space-between"}>
          {/* Left Side*/}
          <Flex alignItems={"center"} gap={3} display={{ sm: "flex" }}>
            <Breadcrumb separator={" "}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink as={Link} to="flights">
                  Voos
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="pilots">
                  Pilotos
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="crew">
                  OCs
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar;
