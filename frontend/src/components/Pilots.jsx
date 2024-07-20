// import PILOTOS from "../dummy/pilotos";
import { Button, Container, Grid, ButtonGroup } from "@chakra-ui/react";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateUserModal from "./CreateUserModal";

const API_URL = "http://127.0.0.1:5051";

const Pilots = () => {
  const [pilotos, setPilotos] = useState([]);
  const [allPilots, setallPilots] = useState([]);

  const handlePositionFilter = (position) => {
    if (position === "ALL") {
      setPilotos(allPilots);
    } else {
      setPilotos(allPilots.filter((piloto) => piloto.position == position));
    }
  };

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`${API_URL}/pilots`);
      // console.log(res);
      setPilotos(res.data || []);
      setallPilots(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedPilots();
  }, []);

  return (
    <Container maxWidth={"1200px"} alignItems={"center"}>
      <CreateUserModal pilotos={pilotos} setPilotos={setPilotos} />
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
