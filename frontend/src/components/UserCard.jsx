/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react/prop-types */
import {
  Card,
  Text,
  Box,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import DaysLeftColumn from "./DaysLeftColumn";

const UserCard = ({ user }) => {
  // console.log(user);
  // console.log(user.qualification?.lastDayLandings);
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
        <Flex flexDirection={"row"}>
          {!!user.qualification?.lastDayLandings ? (
            <DaysLeftColumn
              qualification={"ATD"}
              dates={user.qualification.lastDayLandings}
            />
          ) : null}
          {/* <DaysLeftColumn
            qualification={"ATN"}
            dates={user.qualification.lastNightLandings}
          /> */}
          {/* <DaysLeftColumn
            qualification={"P"}
            dates={user.qualification.lastPrecApp}
          />
          <DaysLeftColumn
            qualification={"NP"}
            dates={user.qualification.lastNprecApp}
          /> */}
          {/* <Box borderColor={"black"} borderWidth={"2px"}>
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
          </Box> */}
          {/* <Box paddingTop={1}>
            <Text paddingX={2} color="black" bg={colorFormatter(user.QA1)}>
              {user.QA1}
            </Text>
            <Text paddingX={2} color="black" bg={colorFormatter(user.QA2)}>
              {user.QA2}
            </Text>
          </Box> */}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserCard;
