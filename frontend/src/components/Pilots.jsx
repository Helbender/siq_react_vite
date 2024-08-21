// import PILOTOS from "../dummy/pilotos";
import { Button, Container, Grid, ButtonGroup } from "@chakra-ui/react";
import UserCard from "./pilotComponents/UserCard";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CreateUserModal from "./pilotComponents/CreateUserModal";
import { AuthContext } from "../AuthContext";

const Pilots = () => {
  const { pilotos } = useContext(AuthContext);
  const handlePositionFilter = (position) => {
    if (position === "ALL") {
      null;
    } else {
      // setPilotos(pilotos.filter((piloto) => piloto.position == position));
      console.log(pilotos);
    }
  };

  return (
    <Container maxWidth={"1200px"} alignItems={"center"}>
      <CreateUserModal />
      <ButtonGroup ml="5" colorScheme="blue">
        <Button onClick={() => handlePositionFilter("ALL")}>Todos</Button>
        <Button onClick={() => handlePositionFilter("PC")}>PC</Button>
        <Button onClick={() => handlePositionFilter("CP")}>CP</Button>
      </ButtonGroup>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2,1fr)",
          lg: "repeat(3,1fr)",
        }}
        gap={5}
        mt="8"
      >
        {pilotos.map((pilot) => (
          <UserCard key={pilot.nip} user={pilot} />
        ))}
      </Grid>
    </Container>
  );
};

export default Pilots;
