import Pilots from "./components/Pilots";
import Crew from "./components/Crew";
import Flights from "./components/Flights";
import Master from "./components/layout/Master";
import LoginPage from "./components/loginComponents/LoginPage";
import RecoverPass from "./components/loginComponents/RecoverPass";
import { Fragment, useContext } from "react";
import Footer from "./components/layout/Footer";
import AboutPage from "./components/About";
import RecoverProcess from "./components/loginComponents/RecoverProcess";

import { AuthContext } from "./Contexts/AuthContext";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import UserManagementPage from "./components/UserC/UserManagementPage";

import Header from "./components/layout/Header";

function App() {
  // const { token, removeToken, setToken } = useToken();
  const { token, removeToken, setToken } = useContext(AuthContext);

  return (
    // <BrowserRouter>
    <HashRouter>
      <Header />
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
              <Route path="/flights" index element={<Flights />} />
              <Route path="/pilots" element={<Pilots />} />
              <Route path="/crew" element={<Crew />} />
              <Route path="/users" element={<UserManagementPage />} />
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
