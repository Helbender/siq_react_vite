import Pilots from "./components/Pilots";
import Crew from "./components/Crew";
import Flights from "./components/Flights";
import Master from "./components/Master";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useToken from "./components/loginComponents/useToken";
import LoginPage from "./components/loginComponents/LoginPage";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import RecoverPass from "./components/loginComponents/RecoverPass";
import PasswordChange from "./components/loginComponents/PasswordChange";
import { Box, Text } from "@chakra-ui/react";
import { Fragment } from "react";
function App() {
  const { token, removeToken, setToken } = useToken();

  function handleLogout() {
    axios({
      method: "POST",
      url: "/api/logout",
    })
      .then((response) => {
        removeToken();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  return (
    <BrowserRouter>
      {/* <RecoverPass /> */}
      {!token && token !== "" && token !== undefined ? (
        <LoginPage setToken={setToken} />
      ) : (
        <Fragment>
          <Routes>
            <Route index element={<Navigate replace to="flights" />} />
            <Route path="/" element={<Master />}>
              <Route
                path="/flights"
                element={<Flights token={token} setToken={setToken} />}
              />
              \
              <Route
                path="/pilots"
                element={
                  <Pilots
                  // pilotos={pilotos}
                  // setPilotos={setPilotos}
                  // getSavedPilots={getSavedPilots}
                  />
                }
              />
              <Route path="/crew" element={<Crew />} />
            </Route>
            <Route
              // this path will match URLs like
              // - /teams/hotspur
              // - /teams/real
              path="/recovery/:token"
              // the matching param will be available to the loader
              loader={({ params }) => {}}
              // and the action
              action={({ params }) => {}}
              element={<PasswordChange />}
            />
          </Routes>
          <Button justifySelf={"center"} onClick={handleLogout}>
            Logout
          </Button>
        </Fragment>
      )}
      <Box
        position={"fixed"}
        bottom={0}
        w="100%"
        bg="gray.300"
        py="3"
        alignItems={"center"}
      >
        <Text textAlign={"center"} color={"black"}>
          Esquadra 502 @ 2024
        </Text>
      </Box>
    </BrowserRouter>
  );
}

export default App;
