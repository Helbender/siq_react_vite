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
=======
import React, { useContext } from 'react';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './components/About';
import LoginPage from './components/loginComponents/LoginPage';
import RecoverPass from './components/loginComponents/RecoverPass';
import RecoverProcess from './components/loginComponents/RecoverProcess';
import UserManagementPage from './components/pilotComponents/UserManagementPage';
import Pilots from './components/Pilots';
import Crew from './components/Crew';
import Flights from './components/Flights';
import Master from './components/Master';
import { AuthContext } from './Context';

function App() {
  const { token, removeToken, setToken } = useContext(AuthContext);

  return (
<HashRouter>
  <Header />
  <Routes>
    {!token ? (
      <>
        <Route path="/" element={<LoginPage setToken={setToken} removeToken={removeToken} />} />
        <Route path="/recover" element={<RecoverPass />} />
        <Route path="/recovery/:token/:email" element={<RecoverProcess />} />
        <Route path="/about" element={<AboutPage />} />
      </>
    ) : (
      <Route path="/" element={<Master />}>
        <Route index element={<Navigate replace to="/flights" />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/pilots" element={<Pilots />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/users" element={<UserManagementPage />} />
      </Route>
    )}
    <Route path="*" element={<Navigate replace to="/" />} />
  </Routes>
  <Footer />
</HashRouter>

>>>>>>> Stashed changes
  );
}

export default App;
