import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const Navbar = () => {
  const location = useLocation();
  const selected_style = {
    bg: "purple.600",
    borderRadius: 10,
    color: "black",
    fontWeight: "bold",
  };
  return (
    <Container maxW={"80%"} mb={10} mt={10}>
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
            <Breadcrumb separator={"-"}>
              <BreadcrumbItem
                isCurrentPage={location.pathname === "/pilots" ? true : false}
              >
                <BreadcrumbLink
                  p={2}
                  as={Link}
                  to="pilots"
                  sx={location.pathname === "/pilots" ? selected_style : null}
                >
                  Pilotos
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem
                p={2}
                isCurrentPage={
                  location.pathname === "/co-pilots" ? true : false
                }
                sx={location.pathname === "/co-pilots" ? selected_style : null}
              >
                <BreadcrumbLink as={Link} to="co-pilots">
                  CPs
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem
                p={2}
                isCurrentPage={location.pathname === "/crew" ? true : false}
                sx={location.pathname === "/crew" ? selected_style : null}
              >
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
