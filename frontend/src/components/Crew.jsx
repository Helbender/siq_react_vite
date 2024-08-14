import { Container, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const Crew = () => {
  let params = useParams();
  console.log(params);
  return (
    <Container>
      <Text>CREW</Text>
    </Container>
  );
};

export default Crew;
