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
import { Fragment } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./components/About";
import RecoverProcess from "./components/loginComponents/RecoverProcess";

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
      <Header />
      {!token && token !== "" && token !== undefined ? (
        <Routes>
          <Route path="/" element={<LoginPage setToken={setToken} />} />
          <Route path="/recover" element={<RecoverPass />} />
          <Route
            exact
            path="/recovery/:token"
            // the matching param will be available to the loader
            loader={({ params }) => {
              console.log(params);
            }}
            // and the action
            action={({ params }) => {
              console.log(params);
            }}
            element={<RecoverProcess />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      ) : (
        <Fragment>
          <Routes>
            {/* <Route index element={<Navigate replace to="flights" />} /> */}

            <Route path="/main" element={<Master />}>
              <Route
                path="/main/flights"
                element={<Flights token={token} setToken={setToken} />}
              />

              <Route
                path="/main/pilots"
                element={
                  <Pilots
                  // pilotos={pilotos}
                  // setPilotos={setPilotos}
                  // getSavedPilots={getSavedPilots}
                  />
                }
              />
              <Route path="/main/crew" element={<Crew />} />
            </Route>
          </Routes>
          <Button justifySelf={"center"} onClick={handleLogout}>
            Logout
          </Button>
        </Fragment>
      )}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
