/* eslint-disable react/prop-types */
// import PILOTOS from "../dummy/pilotos";
import { Button, Container, Grid, ButtonGroup } from "@chakra-ui/react";
import UserCard from "./pilotComponents/PilotCard";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Pilots = ({ position }) => {
  const [pilotos, setPilotos] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { token, removeToken } = useContext(AuthContext);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const buttons = ["Todos", "PC", "CP"];
  const navigate = useNavigate();
  const location = useLocation();
  // const handlePositionFilter = (position, index) => {
  //   setActiveIndex(index);
  //   if (position === "Todos") {
  //     console.log("Todos");
  //     setSearchTerm("");
  //   } else {
  //     setSearchTerm(position);
  //   }
  // };
  // useEffect(() => {
  //   if (searchTerm === "") {
  //     setFilteredUsers(pilotos);
  //   } else {
  //     const results = pilotos?.filter((user) => user.position == searchTerm);
  //     setFilteredUsers(results);
  //   }
  // }, [searchTerm, pilotos]);

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`/api/pilots/${position}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setPilotos(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (error) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status === 401) {
        console.log("Removing Token");
        removeToken();
        navigate("/");
      }
    }
  };
  useEffect(() => {
    getSavedPilots();
    // console.log("Pilots Loaded");
  }, [location]);
  return (
    <Container maxWidth={"1200px"} alignItems={"center"}>
      {/* <ButtonGroup ml="5" colorScheme="blue">
        {buttons.map((label, index) => (
          <Button
            key={index}
            onClick={() => handlePositionFilter(label, index)}
            isActive={activeIndex === index}
            colorScheme={activeIndex === index ? "green" : "blue"} // Optional: Change color based on active state
          >
            {label}
          </Button>
        ))}
      </ButtonGroup> */}
      <Grid
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
    </Container>
  );
};

export default Pilots;
