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
  IconButton,
} from "@chakra-ui/react";
import DaysLeftColumn from "./DaysLeftColumn";
import QualificationsPanel from "./QualificationsPanel";
import { BiTrash } from "react-icons/bi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

const UserCard = ({ user, pilotos, setPilotos }) => {
  const handleDeletePilot = async (nip) => {
    try {
      const res = await axios.delete(`${API_URL}/pilots/${nip}`);
      console.log(res);
      if (res.data?.deleted_id) {
        setPilotos(pilotos.filter((piloto) => piloto.nip != nip));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card bg={useColorModeValue("gray.200", "gray.700")}>
      <CardHeader>
        <Flex gap={4}>
          <Flex flex={"1"} flexDirection={"row"} align="center" gap={"5"}>
            <Circle
              bg={user.position === "PC" ? "blue.500" : "green"}
              size="40px"
              boxShadow="dark-lg"
            >
              {user.position}
            </Circle>
            <Heading size="sm">{`${user.rank} ${user.name}`}</Heading>
          </Flex>
          <Flex align={"center"}>
            {/* <IconButton
              variant="ghost"
              colorScheme="red"
              size={"sm"}
              icon={<BiTrash />}
            /> */}
            <IconButton
              onClick={() => handleDeletePilot(user.nip)}
              variant="ghost"
              colorScheme="red"
              size={"sm"}
              icon={<BiTrash />}
            />
          </Flex>
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
          {!!user.qualification?.lastNightLandings ? (
            <DaysLeftColumn
              qualification={"ATN"}
              dates={user.qualification.lastNightLandings}
            />
          ) : null}
          {!!user.qualification?.lastPrecApp ? (
            <DaysLeftColumn
              qualification={"P"}
              dates={user.qualification.lastPrecApp}
            />
          ) : null}
          {!!user.qualification?.lastNprecApp ? (
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
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              BSP1
            </Text>
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              BSP2
            </Text>
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              TA
            </Text>
          </Box>
          <Box borderColor={"black"} borderWidth={"2px"}>
            <QualificationsPanel qualification={user.qualification?.lastQA1} />
            <QualificationsPanel qualification={user.qualification?.lastQA2} />
            <QualificationsPanel qualification={user.qualification?.lastBSP1} />
            <QualificationsPanel qualification={user.qualification?.lastBSP2} />
            <QualificationsPanel qualification={user.qualification?.lastTA} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserCard;
