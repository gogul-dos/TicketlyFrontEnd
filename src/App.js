import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import CityContext from "./components/cityContext/cityContext";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Home from "./components/home/home";
import MovieDetails from "./components/movieDetails/movieDetails";
import PrivateRoute from "./components/privateRoute/privateRoute";
import TheatreDetails from "./components/theatreDetails/theatreDetails";
import ShowDetails from "./components/showDetails/showDetails";
import SeatLayout from "./components/seatLayout/seatLayout";
import MyBookings from "./components/myBookings/myBookings";
import NotFound from "./components/notFound/notFound";
import "./App.css";

function App() {
  const [city, setCity] = useState("");

  return (
    <CityContext.Provider value={{ city, setCity }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/movies/:movie_id"
              element={
                <PrivateRoute>
                  <CityContext.Consumer>
                    {({ city }) => <MovieDetails city={city} />}
                  </CityContext.Consumer>
                </PrivateRoute>
              }
            />

            <Route
              path="/theatreDetails/:movie_id"
              element={
                <PrivateRoute>
                  <CityContext.Consumer>
                    {({ city }) => <TheatreDetails city={city} />}
                  </CityContext.Consumer>
                </PrivateRoute>
              }
            />

            <Route
              path="/theatre/:theatre_name/:theatre_id"
              element={
                <PrivateRoute>
                  <CityContext.Consumer>
                    {({ city }) => <ShowDetails city={city} />}
                  </CityContext.Consumer>
                </PrivateRoute>
              }
            />

            <Route
              path="/shows/:theatre_id/:movie_id"
              element={
                <PrivateRoute>
                  <CityContext.Consumer>
                    {({ city }) => <ShowDetails city={city} />}
                  </CityContext.Consumer>
                </PrivateRoute>
              }
            />

            <Route
              path="/book/:show_id"
              element={
                <PrivateRoute>
                  <SeatLayout />
                </PrivateRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />

            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Routes>
        </div>
      </Router>
    </CityContext.Provider>
  );
}

export default App;
