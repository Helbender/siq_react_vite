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
    <Container maxW={"60%"} my={10}>
      <Box
        px={5}
        // my={4}
        // mx={10}
        borderRadius={20}
        bg={useColorModeValue("gray.400", "gray.700")}
      >
        <Flex
          h="16"
          alignItems={"center"}
          gap={3}
          justifyContent={"space-around"}
        >
          {/* Left Side*/}
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
              isCurrentPage={location.pathname === "/co-pilots" ? true : false}
            >
              <BreadcrumbLink
                p={2}
                as={Link}
                to="co-pilots"
                sx={location.pathname === "/co-pilots" ? selected_style : null}
              >
                CPs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem
              isCurrentPage={location.pathname === "/crew" ? true : false}
            >
              <BreadcrumbLink
                p={2}
                as={Link}
                sx={location.pathname === "/crew" ? selected_style : null}
                to="crew"
              >
                OCs
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar;
