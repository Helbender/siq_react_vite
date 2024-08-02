import Pilots from "./components/Pilots";
import Crew from "./components/Crew";
import Flights from "./components/Flights";
import Master from "./components/Master";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  // const [pilotos, setPilotos] = useState([]);
  // const getSavedPilots = async () => {
  //   try {
  //     const res = await axios.get(`${API_URL}/pilots`);
  //     // console.log(res);
  //     setPilotos(res.data || []);
  //     // setallPilots(res.data || []);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="flights_page" />} />
        <Route path="/" element={<Master />}>
          <Route path="/flights_page" element={<Flights />} />
          <Route
            path="/pilots_page"
            element={
              <Pilots
              // pilotos={pilotos}
              // setPilotos={setPilotos}
              // getSavedPilots={getSavedPilots}
              />
            }
          />
          <Route path="/crew_page" element={<Crew />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
