import { Box, Text } from "@chakra-ui/react";

const DaysLeftColumn = ({ qualification, dates }) => {
  console.log(qualification, dates);
  function colorFormatter(days) {
    let color = "";
    if (days < 0) return (color = "red");
    if (days < 45) return (color = "yellow");
    // eslint-disable-next-line no-unused-vars
    else return (color = "green");
  }
  return (
    <Box
      borderColor={"black"}
      borderWidth={"2px"}
      //   borderTopRadius={5}
      //   borderBottomRadius={5}
    >
      <Text
        color="white"
        fontSize={"16"}
        fontWeight={"bold"}
        align={"center"}
        bg="grey"
        paddingX={1}
        overflow={"hidden"}
      >
        {qualification}
      </Text>
      {dates.map((date) => (
        <Text bg={colorFormatter(date)} color="black" align={"center"}>
          {date}
        </Text>
      ))}
    </Box>
  );
};

export default DaysLeftColumn;
