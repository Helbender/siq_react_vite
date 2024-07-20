/* eslint-disable react/prop-types */
import { Box, Text } from "@chakra-ui/react";

const DaysLeftColumn = ({ qualification, dates }) => {
  let today = new Date();
  let days = dates.map((date) => {
    let qualificationDate = new Date(date);
    // console.log(`Data da qualificação ${qualificationDate}`);
    let semester = new Date(qualificationDate);
    semester.setDate(qualificationDate.getDate() + 180);
    // console.log(`Mais 180 dias: ${semester.toDateString()}`);
    let days = Math.round(
      // (today.getTime() - (qualificationDate.getTime() + semester)) / 86400000,
      (qualificationDate.setDate(qualificationDate.getDate() + 180) -
        today.getTime()) /
        86400000,
    );
    // console.log(`Hoje é ${today}`);

    return days;
  });
  // console.log(`${qualification} ${days}`);
  // console.log(qualification, dates);
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
      {days.map((a, i) => {
        return (
          <Text key={i} bg={colorFormatter(a)}>
            {a}
          </Text>
        );
      })}
    </Box>
  );
};

export default DaysLeftColumn;
