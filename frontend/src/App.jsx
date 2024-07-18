import Pilots from "./components/Pilots";
import Crew from "./components/Crew";
import Home from "./components/Home";
import Master from "./components/Master";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="home" />} />
        <Route path="/" element={<Master />}>
          <Route path="/home" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/crew" element={<Crew />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
