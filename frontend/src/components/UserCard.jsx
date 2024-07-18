/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Text,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import DaysLeftColumn from "./DaysLeftColumn";

const UserCard = ({ user }) => {
  console.log(user);
  console.log(user.name);
  function colorFormatter(days) {
    let color = "";
    if (days < 0) return (color = "red");
    if (days < 45) return (color = "yellow");
    // eslint-disable-next-line no-unused-vars
    else return (color = "green");
  }
  return (
    <Card bg={useColorModeValue("gray.200", "gray.700")}>
      <CardHeader>
        <Flex flexDirection={"row"} align="center" gap={"5"}>
          <Circle bg="blue.500" size="40px" boxShadow="dark-lg">
            {user.position}
          </Circle>
          <Heading size="sm">{`${user.rank} ${user.name}`}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        {/* <Flex flexDirection={"row"}>
          <DaysLeftColumn qualification={"ATD"} dates={user.ATD} />
          <DaysLeftColumn qualification={"ATN"} dates={user.ATN} />
          <DaysLeftColumn qualification={"P"} dates={user.P} />
          <DaysLeftColumn qualification={"NP"} dates={user.NP} />
          <Box borderColor={"black"} borderWidth={"2px"}>
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              QA1
            </Text>
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              QA2
            </Text>
          </Box>
          <Box paddingTop={1}>
            <Text paddingX={2} color="black" bg={colorFormatter(user.QA1)}>
              {user.QA1}
            </Text>
            <Text paddingX={2} color="black" bg={colorFormatter(user.QA2)}>
              {user.QA2}
            </Text>
          </Box>
        </Flex> */}
      </CardBody>
    </Card>
  );
};

export default UserCard;
