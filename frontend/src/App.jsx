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
      <Button onClick={handleLogout}>Logout</Button>
      {/* <RecoverPass /> */}
      {!token && token !== "" && token !== undefined ? (
        <LoginPage setToken={setToken} />
      ) : (
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
            path="/recovery/:teamId"
            // the matching param will be available to the loader
            // loader={({ params }) => {}}
            // and the action
            // action={({ params }) => {}}
            element={<PasswordChange />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
