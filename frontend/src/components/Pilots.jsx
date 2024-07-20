// import PILOTOS from "../dummy/pilotos";
import { Container, Grid } from "@chakra-ui/react";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateUserModal from "./CreateUserModal";

const API_URL = "http://127.0.0.1:5051";

const Pilots = () => {
  const [pilotos, setPilotos] = useState([]);

  useEffect(() => {
    const getSavedPilots = async () => {
      try {
        const res = await axios.get(`${API_URL}/pilots`);
        // console.log(res);
        setPilotos(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getSavedPilots();
  }, []);

  return (
    <Container maxWidth={"1200px"} alignItems={"center"}>
      <CreateUserModal pilotos={pilotos} setPilotos={setPilotos} />
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2,1fr)",
          lg: "repeat(3,1fr)",
        }}
        gap={5}
      >
        {pilotos.map((pilot) => (
          <UserCard key={pilot.nip} user={pilot} />
        ))}
      </Grid>
    </Container>
  );
};

export default Pilots;
