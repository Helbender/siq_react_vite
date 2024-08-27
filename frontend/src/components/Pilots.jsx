// import PILOTOS from "../dummy/pilotos";
import { Button, Container, Grid, ButtonGroup } from "@chakra-ui/react";
import UserCard from "./pilotComponents/PilotCard";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import axios from "axios";
const Pilots = () => {
  const [pilotos, setPilotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { token } = useContext(AuthContext);

  const handlePositionFilter = (position) => {
    if (position === "ALL") {
      setSearchTerm("");
    } else {
      setSearchTerm(position);
    }
  };
  useEffect(() => {
    console.log(pilotos);
    if (searchTerm === "") {
      setFilteredUsers(pilotos);
    } else {
      const results = pilotos?.filter((user) => user.position == searchTerm);
      setFilteredUsers(results);
    }
  }, [searchTerm, pilotos]);

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/pilots`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(res);
      setPilotos(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedPilots();
    console.log("Users Loaded");
  }, []);
  return (
    <Container maxWidth={"1200px"} alignItems={"center"}>
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
        {filteredUsers.map((pilot) => (
          <UserCard key={pilot.nip} user={pilot} />
        ))}
      </Grid>
    </Container>
  );
};

export default Pilots;
