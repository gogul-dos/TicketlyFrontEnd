import { Component } from "react";
import LoadingScreen from "../loadingScreen/loadingScreen";
import Header from "../header/header";
import Cookies from "js-cookie";
import withNavigation from "../../utils/withNavigation";
import "./showDetails.css";

class ShowDetails extends Component {
  requestStatus = {
    progress: "PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
  };

  state = {
    screenData: [],
    urlStatus: this.requestStatus.progress,
  };

  componentDidMount() {
    this.fetchResults();
  }

  fetchResults = async () => {
    const url = process.env.REACT_APP_BACKEND_URL;
    const { theatre_id } = this.props.params;
    const movie_id = localStorage.getItem("selected_movie_id");
    const token = Cookies.get("token");

    if (!movie_id || !theatre_id) {
      this.setState({ urlStatus: this.requestStatus.failure });
      return;
    }

    try {
      const response = await fetch(
        `${url}/shows?theatre_id=${theatre_id}&movie_id=${movie_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Fetch failed");

      const data = await response.json();
      this.setState({
        screenData: data,
        urlStatus: this.requestStatus.success,
      });
    } catch (error) {
      console.error("Error fetching show details:", error);
      this.setState({ urlStatus: this.requestStatus.failure });
    }
  };

  handleBookNow = (show) => {
    const { navigate } = this.props;

    localStorage.setItem("selected_show_id", show.show_id);
    localStorage.setItem("selected_show_time", show.show_datetime);
    localStorage.setItem("ticket_price", show.ticket_price);
    localStorage.setItem("screen_id", show.screen_id);

    navigate(`/book/${show.show_id}`);
  };

  renderScreensAndShows = () => {
    const { screenData } = this.state;

    if (screenData.length === 0) {
      return <p className="sd-empty">No shows available for this theatre.</p>;
    }

    return (
      <div className="sd-screen-wrapper">
        {screenData.map((screen) => (
          <div className="sd-screen-block" key={screen.screen_id}>
            <div className="sd-screen-info">
              <h2>Screen {screen.screen_number}</h2>
              <p>
                <strong>Type:</strong> {screen.screen_type || "Standard"} 
              </p>
            </div>

            <div className="sd-show-grid">
              {screen.shows.map((show) => (
                <div className="sd-show-card" key={show.show_id}>
                  <p>
                    <strong>Show Time:</strong>{" "}
                    {new Date(show.show_datetime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{show.ticket_price.toFixed(2)}
                  </p>
                  <p>
                    <strong>Available Seats:</strong> {show.available_seats}
                  </p>
                  <button
                    className="sd-book-btn"
                    onClick={() =>
                      this.handleBookNow({
                        ...show,
                        screen_id: screen.screen_id,
                      })
                    }>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  getCurrentView = () => {
    const { urlStatus } = this.state;
    switch (urlStatus) {
      case this.requestStatus.progress:
        return <LoadingScreen />;
      case this.requestStatus.success:
        return this.renderScreensAndShows();
      case this.requestStatus.failure:
      default:
        return <p className="sd-error">Failed to load show details.</p>;
    }
  };

  render() {
    return (
      <>
        <Header />
        <div className="sd-wrapper">{this.getCurrentView()}</div>
      </>
    );
  }
}

export default withNavigation(ShowDetails);
