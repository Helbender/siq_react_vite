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
import EditUserModal from "./EditUserModal";

const UserCard = ({ user, pilotos, setPilotos }) => {
  const handleDeletePilot = async (nip) => {
    try {
      const res = await axios.delete(`/api/pilots/${nip}`);
      console.log(res);
      if (res.data?.deleted_id) {
        setPilotos(pilotos.filter((piloto) => piloto.nip != nip));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card bg={useColorModeValue("gray.200", "gray.700")} boxShadow={"xl"}>
      <CardHeader>
        <Flex gap={4}>
          <Flex flex={"1"} flexDirection={"row"} align="center" gap={"5"}>
            <Circle
              bg={user.position === "PC" ? "blue.500" : "green"}
              size="40px"
              boxShadow="dark-lg"
              pt={"1"}
            >
              {user.position}
            </Circle>
            <Heading size="sm">{`${user.rank} ${user.name}`}</Heading>
          </Flex>
          <Flex align={"center"}>
            <EditUserModal piloto={user} setPilotos={setPilotos} />
            <IconButton
              onClick={() => handleDeletePilot(user.nip)}
              variant="ghost"
              colorScheme="red"
              size={"lg"}
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
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              VRP1
            </Text>
            <Text
              color="white"
              fontSize={"16"}
              fontWeight={"bold"}
              align={"center"}
              paddingX={2}
              bg="grey"
            >
              VRP2
            </Text>
          </Box>
          <Box borderColor={"black"} borderWidth={"2px"}>
            <QualificationsPanel qualification={user.qualification?.lastQA1} />
            <QualificationsPanel qualification={user.qualification?.lastQA2} />
            <QualificationsPanel qualification={user.qualification?.lastBSP1} />
            <QualificationsPanel qualification={user.qualification?.lastBSP2} />
            <QualificationsPanel qualification={user.qualification?.lastTA} />
            <QualificationsPanel qualification={user.qualification?.lastVRP1} />
            <QualificationsPanel qualification={user.qualification?.lastVRP2} />
          </Box>
          <Box borderColor={"black"} borderWidth={"2px"}></Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserCard;
