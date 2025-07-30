import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../header/header";
import LoadingScreen from "../loadingScreen/loadingScreen";
import withNavigation from "../../utils/withNavigation";
import "./theatreDetails.css";
import { Link } from "react-router-dom";

class TheatreDetails extends Component {
  state = {
    status: "LOADING",
    theatres: [],
    cityCount: 0,
    totalCount: 0,
    percentage: 0,
    prevCity: this.props.city,
  };

  componentDidMount() {
    this.fetchTheatreDetails();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.city !== this.props.city) {
      this.setState(
        { status: "LOADING", prevCity: this.props.city },
        this.fetchTheatreDetails
      );
    }
  }

  fetchTheatreDetails = async () => {
    const { movie_id } = this.props.params;
    const jwtToken = Cookies.get("token");
    const { city } = this.props;

    if (!city || city === ":1" || city.trim() === "") {
      console.warn("Invalid or missing city:", city);
      this.setState({ status: "FAILURE" });
      return;
    }

    try {
      const url = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        `${url}/theatreDetails/${movie_id}?city=${encodeURIComponent(city)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Fetch failed");

      const data = await response.json();

      const { theatres = [], cityTheatres = 0, totalTheatres = 1 } = data;

      const percentage = Math.round((cityTheatres / totalTheatres) * 100);

      this.setState({
        theatres,
        cityCount: cityTheatres,
        totalCount: totalTheatres,
        percentage,
        status: "SUCCESS",
      });
    } catch (err) {
      console.error("Error fetching theatre details:", err);
      this.setState({ status: "FAILURE" });
    }
  };

  getAvailabilityClass = (percent) => {
    if (percent >= 50) return "green";
    if (percent >= 20) return "yellow";
    return "red";
  };

  renderTheatreCards = () => {
    const { theatres } = this.state;
    const { movie_id } = this.props.params;

    if (theatres.length === 0) {
      return <p className="bt-no-theatres">No theatres found for this city.</p>;
    }

    return theatres.map((theatre, index) => (
      <Link
        key={index}
        to={`/shows/${theatre.theatreId}/${movie_id}`}
        className="bt-theatre-card">
        <h3 className="bt-theatre-name">{theatre.name}</h3>
        <p className="bt-theatre-city">{theatre.city}</p>
        <p className="bt-theatre-address">
          {theatre.address.replace(/\d+/g, "").trim()}
        </p>
      </Link>
    ));
  };

  render() {
    const { status, percentage } = this.state;
    const availabilityClass = this.getAvailabilityClass(percentage);

    return (
      <>
        <Header />
        <div className="bt-wrapper">
          {status === "LOADING" && <LoadingScreen />}
          {status === "FAILURE" && (
            <p className="bt-error">
              Failed to load theatres. Try changing your city.
            </p>
          )}
          {status === "SUCCESS" && (
            <>
              <div className={`bt-percentage-banner ${availabilityClass}`}>
                {percentage}% of theatres available in your city
              </div>
              <div className="bt-theatre-list">{this.renderTheatreCards()}</div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default withNavigation(TheatreDetails);
