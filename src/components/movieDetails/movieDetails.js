import { Component } from "react";
import { Link } from "react-router-dom";
import withNavigation from "../../utils/withNavigation";
import Header from "../header/header";
import Cookies from "js-cookie";
import LoadingScreen from "../loadingScreen/loadingScreen";
import "./movieDetails.css";

class MovieDetails extends Component {
  state = {
    status: "LOADING",
    movie: null,
  };

  componentDidMount() {
    this.fetchMovieDetails();
  }

  fetchMovieDetails = async () => {
    const { movie_id } = this.props.params;
    const jwtToken = Cookies.get("token");
    localStorage.setItem("selected_movie_id",movie_id);

    try {
      const url = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(url+`/movies/${movie_id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      if (!response.ok) throw new Error("Fetch failed");

      const data = await response.json();
      this.setState({ movie: data, status: "SUCCESS" });
    } catch (err) {
      console.error(err);
      this.setState({ status: "FAILURE" });
    }
  };

  extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  handleBookTickets = () => {
    alert("Fetching theatres and shows for this movie...");
  };

  renderMovieDetails = () => {
    const { movie } = this.state;
    const {city} = this.props;
    if (!movie) return null;

    const {
      title,
      genre,
      rating,
      description,
      poster_url,
      trailer_url,
      release_date,
      language,
      movie_id
    } = movie;

    const trailerId = this.extractYouTubeId(trailer_url);
    return (
      <div className="movie-details-wrapper">
        <div className="movie-card-details">
          <div className="movie-header">
            <img
              src={
                poster_url ||
                "https://via.placeholder.com/300x450?text=No+Poster+Available"
              }
              alt={title}
              className="movie-poster"
            />
            <div className="movie-info-block">
              <h2 className="movie-title">{title}</h2>
              <p className="movie-genre">
                <strong>Genre:</strong> {genre}
              </p>
              <p className="movie-rating">
                <strong>Rating:</strong> {rating}/10
              </p>
              <p className="movie-release">
                <strong>Release Date:</strong> {release_date}
              </p>
              <p className="movie-language">
                <strong>Language:</strong> {language}
              </p>
            </div>
          </div>

          <p className="movie-description">{description}</p>

          {trailerId && (
            <div className="trailer-preview">
              <h3>Watch Trailer</h3>
              <iframe
                title="Trailer"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&loop=1&playlist=${trailerId}&mute=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen></iframe>
            </div>
          )}
          {!city ? <p style={{textAlign:"center", paddingBottom:"15px", fontWeight:"bolder", color:"red"}}>Select City to Book Ticket</p>:
          <Link to={`/theatreDetails/${movie_id}`}>
          <div className="book-button-container">
            <button className="book-btn" >
              Book Tickets
            </button>
          </div>
          </Link>}
        </div>
      </div>
    );
  };

  render() {
    const { status } = this.state;

    return (
      <>
        <Header />
        {status === "LOADING" && (
          <LoadingScreen />
        )}
        {status === "FAILURE" && (
          <p className="error-text">Failed to load movie details.</p>
        )}
        {status === "SUCCESS" && this.renderMovieDetails()}
      </>
    );
  }
}

export default withNavigation(MovieDetails);
