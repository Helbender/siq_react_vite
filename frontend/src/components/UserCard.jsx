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
  function getDays(date) {
    let today = new Date();
    let qualificationDate = new Date(date);
    let semester = new Date(qualificationDate);
    semester.setDate(qualificationDate.getDate() + 180);
    let days = Math.round(
      (qualificationDate.setDate(qualificationDate.getDate() + 180) -
        today.getTime()) /
        86400000,
    );

    return days;
  }
  // console.log(getDays(user.qualification.lastDayLandings));
  // console.log(user.qualification?.lastDayLandings);
  return (
    <Card bg={useColorModeValue("gray.200", "gray.700")}>
      <CardHeader>
        <Flex flexDirection={"row"} align="center" gap={"5"}>
          <Circle
            bg={user.position === "PC" ? "blue.500" : "green"}
            size="40px"
            boxShadow="dark-lg"
          >
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
          {!!user.qualification.lastNightLandings ? (
            <DaysLeftColumn
              qualification={"ATN"}
              dates={user.qualification.lastNightLandings}
            />
          ) : null}
          {!!user.qualification.lastPrecApp ? (
            <DaysLeftColumn
              qualification={"P"}
              dates={user.qualification.lastPrecApp}
            />
          ) : null}
          {!!user.qualification.lastNprecApp ? (
            <DaysLeftColumn
              qualification={"NP"}
              dates={user.qualification.lastNprecApp}
            />
          ) : null}
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
          <Box borderColor={"black"} borderWidth={"2px"}>
            <Text paddingX={2} color="black" bg="grey">
              {getDays(user.qualification.lastQA1)}
            </Text>
            <Text paddingX={2} color="black">
              {getDays(user.qualification.lastQA2)}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserCard;
