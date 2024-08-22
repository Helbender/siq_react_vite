<<<<<<< Updated upstream
import Pilots from "./components/Pilots";
import Crew from "./components/Crew";
import Flights from "./components/Flights";
import Master from "./components/Master";
import { Route, Routes, HashRouter, Navigate } from "react-router-dom";
import useToken from "./components/loginComponents/useToken";
import LoginPage from "./components/loginComponents/LoginPage";
import RecoverPass from "./components/loginComponents/RecoverPass";
import { Fragment } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./components/About";
import RecoverProcess from "./components/loginComponents/RecoverProcess";

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    // <BrowserRouter>
    <HashRouter>
      <Header token={token} removeToken={removeToken} />
      {!token && token !== "" && token !== undefined ? (
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage setToken={setToken} removeToken={removeToken} />
            }
          />
          <Route path="/recover" element={<RecoverPass />} />
          <Route
            exact
            path="/recovery/:token/:email"
            element={<RecoverProcess />}
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      ) : (
        <Fragment>
          <Routes>
            <Route index element={<Navigate replace to="flights" />} />

            <Route path="/" element={<Master />}>
              <Route
                path="/flights"
                index
                element={<Flights token={token} setToken={setToken} />}
              />

              <Route
                path="/pilots"
                element={
                  <Pilots
                    // pilotos={pilotos}
                    // setPilotos={setPilotos}
                    // getSavedPilots={getSavedPilots}
                    token={token}
                    setToken={setToken}
                  />
                }
              />
              <Route path="/crew" element={<Crew />} />
            </Route>
          </Routes>
        </Fragment>
      )}
      <Footer />
    </HashRouter>
    // </BrowserRouter>
  );
}

export default App;
