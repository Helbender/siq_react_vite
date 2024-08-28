/* eslint-disable react/prop-types */
// import PILOTOS from "../dummy/pilotos";
import { Container, Grid } from "@chakra-ui/react";
import UserCard from "../components/pilotComponents/PilotCard";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Pilots = ({ position }) => {
  const [pilotos, setPilotos] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { token, removeToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/pilots/${position}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setPilotos(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (error) {
      console.log(error);
      // console.log(error.response.status);
      // if (error.response.status === 401) {
      //   console.log("Removing Token");
      //   removeToken();
      //   navigate("/");
      // }
    }
  };
  useEffect(() => {
    getSavedPilots();
    // console.log("Pilots Loaded");
  }, [location]);
  return (
    // <Container maxWidth={"1200px"} alignItems={"center"}>

    <Grid
      mx="5"
      templateColumns={{
        base: "1fr",
        md: "repeat(2,1fr)",
        lg: "repeat(3,1fr)",
      }}
      gap={4}
      mt="8"
    >
      {filteredUsers.map((pilot) => (
        <UserCard key={pilot.nip} user={pilot} />
      ))}
    </Grid>
    // </Container>
  );
};

export default Pilots;
